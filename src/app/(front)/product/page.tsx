import FeaturesProduct from "@/components/features-product";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "สินค้าของเราทั้งหมด",
  description: "รายการสินค้าจากฐานข้อมูล eCommerce",
};

// http://localhost:3000/product
export default async function ProductPage() {
  await connection(); // signals this is a dynamic route
  const products = await prisma.products.findMany({
    include: {
      categories: true,
      product_images: {
        orderBy: {
          id: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name ?? "ไม่ระบุชื่อสินค้า",
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    categoryName: product.categories?.name ?? "ไม่ระบุหมวดหมู่",
    imageName: product.product_images[0]?.image_name ?? null,
  }));

  return (
    <main>
      <FeaturesProduct products={serializedProducts} />
    </main>
  );
}
