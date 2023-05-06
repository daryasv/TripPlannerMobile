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

export interface LocationDto {
  longitude: number
  latitude: number
}