interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Mempeak - Vite plugin to show Heap-memory usage',
    description: `A convienent way to see the real-time usage of heap-memory in JS`,
    imgSrc: '/static/images/Vite.svg',
    href: 'https://www.npmjs.com/package/vite-plugin-mempeak',
  },
]

export default projectsData
