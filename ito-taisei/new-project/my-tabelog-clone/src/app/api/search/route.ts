import { NextRequest, NextResponse } from "next/server";
import { getSearchData } from "@/features/search/api/getSearchData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const params: any = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const data = await getSearchData(params);

  return NextResponse.json(data);
}
