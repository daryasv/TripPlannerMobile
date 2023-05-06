export enum postGenreEnum {
  Location,
  Route,
}

export interface PostType {
  dataID: string;
  postGenre: postGenreEnum;
  dateUploaded: string;
  uploadedBy: string;
  cities: string[];
  categories: string[];
  userIdLiked: boolean[];
  comments: string[];
  views: number;
  description: string;
  image: string;
}
