// import Link from 'next/link'

// const links = [
//   {
//     label: 'Home',
//     route: '/',
//   },
//   {
//     label: 'About',
//     route: '/about',
//   },
// ]

export default function Head() {
  return (
    <>
      <title></title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
      <title>My first App 222</title>

      {/* <nav>
        <ul>
          {links.map(({ label, route }) => (
            <li key={route}>
              <Link href={route}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav> */}
    </>
  )
}
