export default {
  locations: [
    {
      token: "locations",
      previewValue: "['location 1', 'location 2']"
    },
    {
      token: "locations.[0]",
      previewValue: "location 1"
    }
  ],
  pendingRequests: [
    {
      token: "pendingRequests",
      previewValue: "[{id: '12345'}, {id: 'abcde'}]"
    },
    {
      token: "pendingRequests.length",
      previewValue: 2
    }
  ],
  numRequests: [
    {
      token: 'numRequests',
      previewValue: 35
    }
  ],
  summary: [
    {
      token: 'summary',
      previewValue: "[[9, 'location 4'], [12, 'location 6'], [1, 'location 15']]"
    }
  ],
  foliourl: [
    {
      token: 'foliourl',
      previewValue: 'https://folio.url.for.this.install'
    }
  ]
};
