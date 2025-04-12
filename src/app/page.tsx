import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Index Page</h1>
      <hr/>
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/dashboard/admin">Admin</Link>
        </li>
      </ul>
    </>);
}
