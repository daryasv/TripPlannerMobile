export enum postGenreEnum {
  Location,
  Route,
}

export interface PostType {
  contentData: ContentData
  postGenre: number
  dateUploaded: string
  uploadedBy: string
  cities: string[]
  categories: string[]
  comments: any[]
  views: number
  dataID: string
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