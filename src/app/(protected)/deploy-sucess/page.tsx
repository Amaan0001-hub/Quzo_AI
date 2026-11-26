"use client";

import { CheckCircle, Clock, Download, Mail, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, Suspense } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PageLoader } from "@/components/common/PageLoader";
import { useTempStorage } from "@/app/components/useTempStorage";

interface OrderData {
  name: string;
  image: string;
  Rkprice: string | number;
  PartnerName: string;
  usernameInput: string;
  orderId: string;
}

interface Order {
  orderId: string;
  productName: string;
  partnerName: string;
  price: string;
  billingCycle: string;
  startDate: string;
  nextBillingDate: string;
  features: string[];
  productImage?: string;
  customerName: string;
  customerEmail: string;
  customerUsername: string;
  transactionDate: string;
  subtotal: string;
  tax: number;
  total: string;
}

function ThankYouContent() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [orderData] = useTempStorage<OrderData>("orderData");
  console.log("YIYIYIYI",orderData);
  const [isLoading, setIsLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerUsername, setCustomerUsername] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [productImageBase64, setProductImageBase64] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomerName("");
      setCustomerEmail("");
      setCustomerUsername("");

      const loadLogo = async () => {
        try {
          const response = await fetch("/logo.png");
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setLogoDataUrl(reader.result as string);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error("Failed to load logo:", error);
        }
      };

      loadLogo();
      setTimeout(() => setIsLoading(false), 100);
    }
  }, []);

  useEffect(() => {
    const toBase64 = async (
      url: string,
      setter: (value: string) => void
    ) => {
      try {
        const response = await fetch(url, { mode: "cors" });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result as string);
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Failed to load image:", err);
      }
    };

    if (orderData?.image) {
      toBase64(orderData.image, setProductImageBase64);
    }
  }, [orderData]);

  const order: Order = {
    orderId:
      orderData?.orderId || `ORD-${Math.floor(1000 + Math.random() * 900000)}`,
    productName: orderData?.name || "AI Agent ",
    partnerName: orderData?.PartnerName || "AI Agent Deploy",
    price: orderData?.Rkprice?.toString() || "100",
    billingCycle: "Monthly",
    startDate: new Date().toLocaleDateString(),
    nextBillingDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    features: [
      "24/7 Availability",
      "10 tasks/hour limit",
      "Email support",
      "Basic analytics",
    ],
    productImage: orderData?.image,
    customerName,
    customerEmail,
    customerUsername,
    transactionDate: new Date().toLocaleString(),
    subtotal: orderData?.Rkprice?.toString() || "",
    tax: 0,
    total: orderData?.Rkprice?.toString() || "",
  };
  console.log("XXXXXX",order)

  const downloadInvoice = async () => {
    if (!invoiceRef.current || isGeneratingPDF) return;
    setIsGeneratingPDF(true);

    try {
      const node = invoiceRef.current.cloneNode(true) as HTMLElement;
      node.style.display = "block";
      node.style.position = "absolute";
      node.style.left = "-9999px";
      document.body.appendChild(node);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#000000",
        logging: false,
      });

      document.body.removeChild(node);

      if (!canvas) {
        throw new Error("Canvas generation failed");
      }

      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`invoice-${order.orderId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text("Invoice", 105, 15, { align: "center" });
      pdf.setFontSize(12);
      pdf.text(`Order ID: ${order.orderId}`, 20, 30);
      pdf.text(`Product: ${order.productName}`, 20, 40);
      pdf.text(`Total: $${order.total}`, 20, 50);
      pdf.text(`Customer: ${order.customerName}`, 20, 60);
      pdf.text(`Email: ${order.customerEmail}`, 20, 70);
      pdf.save(`invoice-${order.orderId}.pdf`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageLoader />
      </div>
    );
  }

  const productImageUrl = order.productImage?.startsWith("http")
    ? `/api/image-proxy?url=${encodeURIComponent(order.productImage)}`
    : `https://velvora.ai/${order.productImage}`;

  return (
    <div className="flex items-center justify-center min-h-screen px-2 py-12 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl p-8 border border-gray-200 shadow-2xl bg-white/90 dark:bg-gray-900/90 rounded-3xl sm:p-12 dark:border-white">
        <div className="mb-12 text-center">
          <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500 drop-shadow-lg animate-bounce" />
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Thank You for Deployed!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your order has been confirmed and your AI agent is deployed
          </p>
          <button
            onClick={downloadInvoice}
            disabled={isGeneratingPDF}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 mt-4 text-sm font-semibold text-white transition-all rounded-xl bg-[#235ae3] shadow-2xl shadow-blue-500/25 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <span className="animate-pulse max-w-[300px] w-full">
                Generating...
              </span>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Invoice
              </>
            )}
          </button>
        </div>

        {/* Invoice template - hidden but used for PDF generation */}
        <div ref={invoiceRef} className="hidden">
          <div className="relative mx-auto bg-white text-gray-900 shadow-md rounded-md p-6 w-[794px] min-h-[1123px]">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src="/VelvoraLogo.png"
                alt="Logo"
                className="h-12"
                crossOrigin="anonymous"
              />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between pb-2 mb-4 border-b">
              <div>
                <h1 className="text-xl font-bold">Invoice</h1>
                <p className="text-sm text-gray-600">Order #: {order.orderId}</p>
              </div>
              <div className="text-right">
                <h2 className="text-base font-semibold">AI Agent Deployed</h2>
                <p className="text-sm text-gray-600">
                  Invoice Date: {new Date().toLocaleDateString()}
                </p>
                {order.productImage && (
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <img
                      src={productImageUrl}
                      alt={order.productName}
                      className="object-cover w-8 h-8 rounded"
                      crossOrigin="anonymous"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="flex justify-between mb-4 text-sm">
              <div>
                <p className="font-semibold">Billed To:</p>
                <p>{orderData?.usernameInput || order.customerUsername}</p>
              </div>
              <div className="text-right">
                <p>Transaction Date:</p>
                <p>{order.transactionDate}</p>
              </div>
            </div>

            {/* Product */}
            <div className="flex items-center p-3 mb-4 text-sm border rounded bg-gray-50">
              {order.productImage && (
                <img
                  src={productImageUrl}
                  alt={order.productName}
                  className="object-cover w-12 h-12 mr-3 rounded"
                  crossOrigin="anonymous"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              )}

              <div className="mb-4">
                <p className="font-bold">{order.productName}</p>
                <p className="text-gray-600">{order.partnerName} </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-3 mb-4 text-sm border rounded bg-gray-50">
              <h3 className="mb-1 font-semibold">Order Details:</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order.tax}</span>
                </div>

                {/* Line + Total */}
                <div className="pt-2 mt-4 border-gray-300">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${order.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="p-3 mb-4 text-sm border rounded bg-gray-50">
              <h3 className="mb-1 font-semibold">Features Included:</h3>
              <ul className="pl-4 text-gray-700 list-disc">
                {order.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="pt-2 text-xs text-center text-gray-500 border-t">
              <p>Thank you for your business!</p>
              <p>
                For questions contact{" "}
                <span className="font-medium">hello@Quzo.io</span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-8 mb-10 border border-gray-200 shadow-md rounded-2xl bg-gray-50 dark:bg-gray-800/80 dark:border-gray-800">
          <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <CheckCircle className="w-6 h-6 text-green-500" /> Order Summary
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Order Details
              </h3>
              <div className="space-y-3 ">
                <p className="flex justify-between text-base border-b border-gray-400">
                  <span className="text-gray-600 dark:text-gray-400">
                    Order ID:
                  </span>
                  <span className="max-w-xs font-bold text-right break-words md:max-w-sm lg:max-w-md">
                    {order.orderId}
                  </span>
                </p>
                <p className="flex items-start justify-between text-base border-b border-gray-400">
                  <span className="text-gray-600 dark:text-gray-400">
                    Agent Name
                  </span>
                  <span className="max-w-xs font-bold text-right break-words md:max-w-sm lg:max-w-md">
                    {order.productName}
                  </span>
                </p>
                <p className="flex justify-between text-base border-b border-gray-400">
                  <span className="text-gray-600 dark:text-gray-400">
                    Amount:
                  </span>
                  <span className="max-w-xs font-bold text-right break-words md:max-w-sm lg:max-w-md">
                    ${order.price}
                  </span>
                </p>

                <p className="flex justify-between text-base border-b border-gray-400">
                  <span className="text-gray-600 dark:text-gray-400">
                    Date:
                  </span>
                  <span className="max-w-xs font-bold text-right break-words md:max-w-sm lg:max-w-md">
                    {order.startDate}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-8 mb-10 transition-all duration-300 border border-gray-200 shadow-lg rounded-3xl bg-gradient-to-br from-green-50 via-blue-50 to-blue-50 dark:from-green-900/40 dark:via-blue-900/30 dark:to-blue-900/30 dark:border-gray-800">
          <h2 className="flex items-center gap-3 mb-8 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            <Zap className="text-blue-500 w-7 h-7 animate-pulse" /> Next Steps
          </h2>

          <div className="space-y-8">
            <div className="flex-wrap-md flex items-start gap-5 p-5 rounded-2xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="p-4 rounded-full shadow-inner bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Check Your Email
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We&apos;ve sent a confirmation email with your order details
                  and instructions to access your AI agent.
                </p>
              </div>
            </div>

            <div className="flex-wrap-md flex items-start gap-5 p-5 rounded-2xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="p-4 rounded-full shadow-inner bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Access Your Agent
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your AI agent is now available in your dashboard. You can
                  start using it immediately.
                </p>

                <Link
                  href="/home"
                  className="inline-block mt-2 font-medium text-blue-600 transition-colors duration-200 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Go to Dashboard →
                </Link>
              </div>
            </div>

            <div className="flex-wrap-md flex items-start gap-5 p-5 rounded-2xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="p-4 rounded-full shadow-inner bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Need Help?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our support team is available 24/7 to help you get started or
                  answer any questions.
                </p>
                <Link
                  href="/support"
                  className="inline-block mt-2 font-medium text-blue-600 transition-colors duration-200 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Included */}
        <div className="p-8 mb-10 border border-gray-200 shadow-lg bg-gradient-to-b from-white to-gray-50 rounded-2xl dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
          <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <CheckCircle className="text-green-500 w-7 h-7 drop-shadow-sm" />
            What&apos;s Included
          </h2>

          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {order.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-4 transition-all duration-300 ease-in-out border border-green-100 shadow-sm group rounded-xl bg-green-50/80 dark:bg-green-900/20 dark:border-green-800 hover:shadow-md hover:border-green-300 dark:hover:border-green-600"
              >
                <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white transition-transform duration-300 bg-green-500 rounded-full shadow-sm group-hover:scale-110">
                  <CheckCircle className="w-5 h-5" />
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/deploy-agents"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all rounded-xl bg-[#235ae3] shadow-2xl shadow-blue-500/25 hover:opacity-90"
          >
            Deploy More AI Agents
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DeploySuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-full">
          <PageLoader />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
