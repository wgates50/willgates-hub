import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const TEAM_ID = process.env.VERCEL_TEAM_ID || "team_OuODA23GunZTZvhNNMQ2IDYP"

export async function GET() {
  const stats = {
    activeProjects: 6,
    automationsRunning: 6,
    deploymentsThisMonth: 0,
    totalDeployments: 0,
  }

  if (!VERCEL_TOKEN) {
    return NextResponse.json(stats)
  }

  try {
    // Fetch projects from Vercel
    const projectsRes = await fetch(
      `https://api.vercel.com/v9/projects?teamId=${TEAM_ID}&limit=50`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )

    if (projectsRes.ok) {
      const projectsData = await projectsRes.json()
      stats.activeProjects = projectsData.projects?.length ?? 6
    }

    // Fetch deployments for last 30 days
    const since = Date.now() - 30 * 24 * 60 * 60 * 1000
    const deploymentsRes = await fetch(
      `https://api.vercel.com/v6/deployments?teamId=${TEAM_ID}&since=${since}&limit=100&state=READY`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
        next: { revalidate: 300 },
      }
    )

    if (deploymentsRes.ok) {
      const deploymentsData = await deploymentsRes.json()
      stats.deploymentsThisMonth = deploymentsData.deployments?.length ?? 0
    }

    // Total deployments (all time, limited to 100)
    const allDeploymentsRes = await fetch(
      `https://api.vercel.com/v6/deployments?teamId=${TEAM_ID}&limit=100&state=READY`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
        next: { revalidate: 300 },
      }
    )

    if (allDeploymentsRes.ok) {
      const allData = await allDeploymentsRes.json()
      stats.totalDeployments = allData.deployments?.length ?? 0
    }
  } catch (error) {
    console.error("Stats API error:", error)
  }

  return NextResponse.json(stats)
}
