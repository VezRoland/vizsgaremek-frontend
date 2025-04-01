import { BrowserRouter } from "react-router"
import "@testing-library/jest-dom"
import { render } from "@testing-library/react"

import { UserContext } from "~/lib/utils"
import { UserRole, type User } from "~/types/database"
import type { ScheduleWeek } from "~/types/results"
import { ScheduleTable } from "~/components/schedule-table/schedule-table"

describe("Employee role tests", () => {
  const mockUser: User = {
    id: crypto.randomUUID(),
    name: "John Doe",
    age: 24,
    hourly_wage: 2000,
    role: UserRole.Employee,
    verified: true,
    company_id: crypto.randomUUID(),
    created_at: new Date().toString()
  }

  const mockScheduleData: ScheduleWeek = {
    weekStart: new Date().toString(),
    prevDate: null,
    nextDate: null,
    schedule: { "12-0": 1 }
  }

  afterEach(() => document.body.innerHTML = "")

	test("Renders the shift section with the correct starting hour", () => {
		const table = render(
			<BrowserRouter>
				<UserContext.Provider value={mockUser}>
					<ScheduleTable data={mockScheduleData} />
				</UserContext.Provider>
			</BrowserRouter>
		)

		const tableItem = table.getByText("12:00")
    expect(tableItem).toBeInTheDocument()
	})

  test("Renders the shift section without displaying the amount of employees assigned", () => {
		const table = render(
			<BrowserRouter>
				<UserContext.Provider value={mockUser}>
					<ScheduleTable data={mockScheduleData} />
				</UserContext.Provider>
			</BrowserRouter>
		)

		const tableItem = table.queryByText("1 employee")
    expect(tableItem).toBeNull()
	})
})

describe("Leader role tests", () => {
  const mockUser: User = {
    id: crypto.randomUUID(),
    name: "John Doe",
    age: 24,
    hourly_wage: 2000,
    role: UserRole.Leader,
    verified: true,
    company_id: crypto.randomUUID(),
    created_at: new Date().toString()
  }

  const mockScheduleData: ScheduleWeek = {
    weekStart: new Date().toString(),
    prevDate: null,
    nextDate: null,
    schedule: { "12-0": 10 }
  }

  afterEach(() => document.body.innerHTML = "")

  test("Renders the shift section with the amount of employees assigned", () => {
		const table = render(
			<BrowserRouter>
				<UserContext.Provider value={mockUser}>
					<ScheduleTable data={mockScheduleData} />
				</UserContext.Provider>
			</BrowserRouter>
		)

		const tableItem = table.getByText("10 employees")
    expect(tableItem).toBeInTheDocument()
	})
})
