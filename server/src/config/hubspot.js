import Hubspot from '@hubspot/api-client';

export const hubspotClient = new Hubspot.Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN || ''
});
