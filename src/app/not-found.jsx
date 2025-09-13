import Link from "next/link";
import React from "react";

export default function notfound() {
  return (
    <div className="text-center mt-50 justify-between">
      <h1>not-found</h1>
      <Link href="/" className="btn">
        Back Home
      </Link>
    </div>
  );
}
