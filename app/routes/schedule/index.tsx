import { Link, Outlet } from "react-router"
import { Button } from "~/components/ui/button"

export default function Schedule() {
	return (
    <>
      <Outlet />
      <main>
        <h1>Hello World!</h1>
        <Button asChild>
          <Link to="/schedule/new">
            Open dialog
          </Link>
        </Button>
      </main>
    </>
  )
}
