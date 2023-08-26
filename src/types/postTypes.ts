export enum postGenreEnum {
  Location,
  Route,
}

export interface PostType {
  UploadByProfilePictureUrl: string
  categories: string[]
  cities: string[]
  comments: any[]
  contentData: ContentData
  dataID: string
  dateUploaded: string
  numOfSaves: number
  postGenre: number
  uploadedBy: string
  views: number
}

export interface ContentData {
  locationDTO: LocationDto
  descriptionDTO: string
  imageFileNameDTO: string
}

export interface ContentData {
  locationsDTO: LocationDto[],
  totalDistanceDTO: number
  totalDurationDTO: number
  pinnedLocationsDTO: PinnedLocationDTO[]
}

export interface LocationDto {
  longitude: number
  latitude: number
  _id: number
}

export interface PinnedLocationDTO{
  imageFileNameDTO: string
  locationDTO: LocationDto
  dateUploadedDTO: Date
  uploadedByDTO: string
  descriptionDTO: string
}