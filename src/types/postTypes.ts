export enum postGenreEnum {
  Location,
  Route,
}

export interface PostType {
  contentData: ContentData;
  postGenre: number;
  dateUploaded: string;
  uploadedBy: string;
  cities: string[];
  categories: any[];
  numOfSaves: number;
  comments: any[];
  views: number;
  dataID: string;
  UploadByProfilePictureUrl: string;
  isSavedByUser: boolean;
}

export interface ContentData {
  descriptionDTO: string;
  totalDistanceDTO: number;
  totalDurationDTO: number;
  locationsDTO: LocationsDto;
  pinnedLocationsDTO: PinnedLocationsDto;
  imageFileNameDTO: string;
}

export interface LocationsDto {
  day1: LocationDay[];
}

export interface LocationDay {
  longitude: number;
  latitude: number;
  accuracy?: number;
  altitude: any;
  altitudeAccuracy: any;
  heading: any;
  speed: any;
}

export interface PinnedLocationsDto {
  day1: PinnedDay[];
}

export interface PinnedDay {
  contentData: PinnedContentData;
  postGenre: number;
  dateUploaded: string;
  uploadedBy: string;
  cities: string[];
  categories: string[];
  numOfSaves: number;
  comments: any[];
  views: number;
  dataID: string;
  UploadByProfilePictureUrl: string;
}

export interface PinnedContentData {
  locationDTO: LocationDto;
  descriptionDTO: string;
  imageFileNameDTO: string;
}

export interface LocationDto {
  longitude: number;
  latitude: number;
}
