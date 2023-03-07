import { ErrorResponse } from '@remix-run/router'

const API_KEY = 'ed8f5e6c3b01b09d1cf884f7315fc7de'
const BASE_URL = 'https://api.themoviedb.org/3'

export interface IMedia {
  id: number
  backdrop_path: string
  poster_path: string
  overview: string
  media_type: string
  name?: string
  title?: string
}

export interface IGetMdediasResult {
  dates?: {
    maximum: string
    minimun: string
  }
  page: number
  results: IMedia[]
  total_page: number
  total_results: number
}

interface IGenre {
  name: string
}

interface ISeason {
  name: string
  overview: string
}

export interface IGetMediaResult {
  id: number
  genres: IGenre[]
  overview: string
  popularity: number
  vote_average: number
  release_date?: string
  first_air_date?: string
  seasons?: ISeason
}

export function getNowPlayingMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  )
}

export function getLatestMovie() {
  console.log(`${BASE_URL}/movie/latest?api_key=${API_KEY}`)
  return fetch(`${BASE_URL}/movie/latest?api_key=${API_KEY}`).then((response) =>
    response.json()
  )
}

export function getTopRatedMovies() {
  return fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  )
}

export function getUpcomingMovies() {
  return fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  )
}

export function getMedia(mediaType: string, mediaId: number) {
  return fetch(`${BASE_URL}/${mediaType}/${mediaId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  )
}

export function getAiringTodayTvShows() {
  return fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  )
}
export function getPopularTvShows() {
  return fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  )
}
export function getTopRatedTvShows() {
  return fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`).then((response) =>
    response.json()
  )
}

export function searchMedia(keyword: string) {
  return fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json())
}
