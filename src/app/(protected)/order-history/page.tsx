import { OrderHistoryTable } from "@/features/order-history/components/OrderHistoryTable";

export default function OrderHistoryPage() {
  return (
    <div className=" w-full bg-[#fdfdfd] p-4 dark:bg-[#0b0d12] md:p-6 lg:p-8 rounded-2xl">
      
      {/* HEADER SECTION (Content Same, Design Improved) */}
      <div className="mx-auto mb-6 w-full">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Order History
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your order history and recharge details.
        </p>
      </div>

      {/* MAIN CARD SECTION */}
      <div className="mx-auto w-full ">
        <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111318]">
          
          {/* Top Gradient Line (Exactly like the image) */}
          <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-teal-500 via-teal-400 to-blue-900" />

          {/* Table Content */}
          <div className="pt-[3px]">
            <OrderHistoryTable />
          </div>
          
        </div>
      </div>

    </div>
  );
}