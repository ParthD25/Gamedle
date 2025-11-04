// any file with extension "".css" will be treated as a valid module
declare module '*.css' {
  const content: string
  export default content
}
