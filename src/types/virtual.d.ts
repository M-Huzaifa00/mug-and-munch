declare module 'virtual:photos' {
  /** Extension-less public path → real file URL, for photos present in public/images. */
  const photos: Record<string, string>
  export default photos
}
