import CartButton from "@/app/(front)/components/CartButton";
import Image from "next/image";

export type ProductCardItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  imageName: string | null;
};

type Props = {
  products: ProductCardItem[];
};

function getProductImage(product: ProductCardItem) {
  return product.imageName
    ? `/product-image/${product.imageName}`
    : "/product-image/nopic.png";
}

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const FeaturesProduct = ({ products }: Props) => {
  return (
    <section className="mx-auto flex max-w-7xl flex-col px-6 py-14 sm:py-20">
      <h2 className="text-pretty text-center font-medium text-4xl tracking-[-0.04em] sm:text-[2.75rem]">
        สินค้าของเราทั้งหมด
      </h2>

      {products.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed px-6 py-12 text-center text-muted-foreground">
          ยังไม่มีสินค้าในฐานข้อมูล
        </div>
      ) : (
      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article className="flex rounded-lg border bg-card px-6 py-7" key={product.id}>
            <div className="flex w-full flex-col">
              <div className="relative mb-5 aspect-4/5 w-full overflow-hidden rounded-lg bg-muted sm:mb-6">
                <Image
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={getProductImage(product)}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="rounded-md bg-primary/5 px-3 py-1 text-sm font-medium text-primary dark:bg-primary/15">
                  #{product.id}
                </span>
                <span className="text-sm text-muted-foreground">
                  {product.categoryName}
                </span>
              </div>
              <h3 className="mt-5 font-medium text-lg tracking-[-0.005em]">
                {product.name}
              </h3>
              <p className="mt-2 line-clamp-2 min-h-12 text-base text-foreground/70">
                {product.description}
              </p>
              <p className="mt-4 text-xl font-semibold">
                {priceFormatter.format(product.price)}
              </p>
              <div className="mt-auto">
                <CartButton product={product} />
              </div>
            </div>
          </article>
        ))}
      </div>
      )}
    </section>
  );
};

export default FeaturesProduct;
