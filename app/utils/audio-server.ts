export type AudioType = {
  id: string;
  title: string;
  audioUrl: string;
}[];

export const audioData: AudioType = [
  {
    id: "1a",
    title: "portland",
    audioUrl:
      "\thttps://remix-bucket.s3.us-east-2.amazonaws.com/Black+Marble+-+It's+Immaterial+-+10+Portland+U.mp3](https://remix-bucket.s3.us-east-2.amazonaws.com/Black+Marble+-+It's+Immaterial+-+10+Portland+U.mp3",
  },
  {
    id: "2a",
    title: "withouth place",
    audioUrl:
      "https://remix-bucket.s3.us-east-2.amazonaws.com/Thomas+Happ+-+Axiom+Verge+Soundtrack+-+16+Without+Place.flac](https://remix-bucket.s3.us-east-2.amazonaws.com/Thomas+Happ+-+Axiom+Verge+Soundtrack+-+16+Without+Place.flac",
  },
];
