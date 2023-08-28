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
  categories: any[]
  numOfSaves: number
  comments: any[]
  views: number
  dataID: string
  UploadByProfilePictureUrl: string
  isSavedByUser: boolean
}

export interface ContentData {
  descriptionDTO: string
  totalDistanceDTO: number
  totalDurationDTO: number
  locationsDTO: LocationsDto
  pinnedLocationsDTO: PinnedLocationsDto
  imageFileNameDTO:string

}

export interface LocationsDto {
  day1: LocationDay[]
}

export interface LocationDay {
  latitude: number
  longitude: number
}

export interface PinnedLocationsDto {
  day1: PinnedDay[]
}

export interface PinnedDay {
  contentData: ContentData
  postGenre: number
  dateUploaded: string
  uploadedBy: string
  cities: string[]
  categories: string[]
  numOfSaves: number
  comments: any[]
  views: number
  dataID: string
  UploadByProfilePictureUrl: string
}
