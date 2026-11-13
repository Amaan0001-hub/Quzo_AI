import type { ReactNode } from "react";
import { toast } from "sonner";

export type SmartLinkProps = {
  /** Destination URL. An empty string (or `undefined`) renders a "coming soon" button instead of an anchor. */
  href?: string;
  /** Human-readable name, used in the default "coming soon" toast message. */
  label: string;
  className?: string;
  children: ReactNode;
  /** Forwarded to `data-testid` on the rendered anchor/button. */
  testId?: string;
  /** Overrides the default toast message when `href` is empty. */
  soon?: string;
};

export const SmartLink = ({ href, label, className, children, testId, soon }: SmartLinkProps) => {
  if (href) {
    const external = /^https?:\/\//.test(href) || href.endsWith(".pdf");
    return (
      <a
        href={href}
        className={className}
        data-testid={testId}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      data-testid={testId}
      onClick={() => toast(soon || `${label} will be published here soon.`)}
    >
      {children}
    </button>
  );
};