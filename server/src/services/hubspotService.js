import { hubspotClient } from '../config/hubspot.js';

/**
 * Create/update a HubSpot contact for the applicant, and add a note with job info.
 * Requires a Private App token with CRM scopes.
 */
export async function upsertHubspotApplicant(app) {
  if (!hubspotClient.configuration?.accessToken) {
    console.warn('HubSpot token missing; skipping HubSpot sync.');
    return null;
  }

  const email = app.email.toLowerCase();
  // Upsert contact
  const contactProps = {
    email,
    firstname: app.firstName,
    lastname: app.lastName,
    phone: app.phone || '',
    // Custom properties can be created in HubSpot UI and referenced here:
    avero_job_id: app.jobId,
    avero_job_title: app.jobTitle,
    avero_resume_url: app.resumeUrl,
    avero_experience: app.experience || '',
  };

  try {
    // Try to find existing contact by email
    let vid = null;
    try {
      const search = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [{
          filters: [{ propertyName: 'email', operator: 'EQ', value: email }]
        }],
        properties: Object.keys(contactProps)
      });
      if (search?.results?.[0]) {
        vid = search.results[0].id;
      }
    } catch {}

    if (vid) {
      await hubspotClient.crm.contacts.basicApi.update(vid, { properties: contactProps });
    } else {
      const created = await hubspotClient.crm.contacts.basicApi.create({ properties: contactProps });
      vid = created.id;
    }

    // Add an engagement note with cover letter
    const note = `Applied for ${app.jobTitle} (${app.jobId})
Resume: ${app.resumeUrl}
Experience: ${(app.experience || '').slice(0, 1000)}
Cover Letter: ${(app.coverLetter || '').slice(0, 2000)}`;

    await hubspotClient.crm.notes.basicApi.create({
      properties: { hs_note_body: note },
      associations: [{ to: { id: vid }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] }]
    });

    return { contactId: vid };
  } catch (err) {
    console.error('HubSpot sync error:', err?.response?.body || err.message);
    return null;
  }
}
