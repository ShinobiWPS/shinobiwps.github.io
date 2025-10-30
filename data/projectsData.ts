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
    imgSrc: '/static/images/',
    href: 'https://www.npmjs.com/package/vite-plugin-mempeak',
  },
  {
    title: 'Open Source contributions',
    description: `Where I improved something publickly available`,
    imgSrc: '/static/images/opensource_logo.png',
    href: 'https://www.google.com',
  },
  {
    title: 'The Time Machine',
    description: `Imagine being able to travel back in time or to the future. Simple turn the knob
    to the desired date and press "Go". No more worrying about lost keys or
    forgotten headphones with this simple yet affordable solution.`,
    imgSrc: '/static/images/time-machine.jpg',
    href: '/blog/the-time-machine',
  },
]

export default projectsData
