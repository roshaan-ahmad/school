import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { GeneratedTest } from "@/app/models/GeneratedTest";

const norm = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");

const serialize = (t) => ({
  id: t.testId,
  createdAt: new Date(t.createdAt).toISOString(),
  config: t.config || {},
  paper: t.paper,
});

async function getAll(ownerEmail) {
  const list = await GeneratedTest.find({ ownerEmail }).sort({ createdAt: -1 }).lean();
  return list.map(serialize);
}

export async function GET(req) {
  try {
    const email = norm(new URL(req.url).searchParams.get("email"));
    if (!email) return NextResponse.json({ success: false, message: "email required" }, { status: 400 });
    await connectDB();
    return NextResponse.json({ success: true, tests: await getAll(email) });
  } catch (e) {
    console.error("GET /api/tests:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const email = norm(body.email);
    const tests = body.tests;

    if (!email) return NextResponse.json({ success: false, message: "email required" }, { status: 400 });
    if (!Array.isArray(tests)) return NextResponse.json({ success: false, message: "tests must be array" }, { status: 400 });

    await connectDB();

    for (const t of tests) {
      if (!t?.id || !t?.paper) continue;
      await GeneratedTest.findOneAndUpdate(
        { ownerEmail: email, testId: t.id },
        {
          $set: { config: t.config || {}, paper: t.paper },
          $setOnInsert: {
            ownerEmail: email,
            testId: t.id,
            createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
          },
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, tests: await getAll(email) });
  } catch (e) {
    console.error("POST /api/tests:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const email = norm(body.email);
    const testId = body.id;
    if (!email || !testId) return NextResponse.json({ success: false, message: "email and id required" }, { status: 400 });
    await connectDB();
    await GeneratedTest.deleteOne({ ownerEmail: email, testId });
    return NextResponse.json({ success: true, tests: await getAll(email) });
  } catch (e) {
    console.error("DELETE /api/tests:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
