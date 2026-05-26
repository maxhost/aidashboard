"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type Side = "buyer" | "seller";

type ExtractStatus = "idle" | "extracting" | "extracted";

type FormState = {
  address: string;
  side: Side;
  client: string;
  closingDate: string;
  lender: string;
  loanOfficer: string;
  title: string;
  tc: string;
  broker: string;
  inspector: string;
  appraiser: string;
  photographer: string;
  stager: string;
  mover: string;
  hoa: string;
  utilities: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  address: "",
  side: "buyer",
  client: "",
  closingDate: "",
  lender: "",
  loanOfficer: "",
  title: "",
  tc: "",
  broker: "",
  inspector: "",
  appraiser: "",
  photographer: "",
  stager: "",
  mover: "",
  hoa: "",
  utilities: "",
  notes: "",
};

/**
 * Simulated extraction result. In a real backend pass this would come from an
 * AI contract-parsing endpoint; here it just demonstrates the UX of "I read
 * the contract for you — confirm what I got."
 */
const SIMULATED_EXTRACTION: Partial<FormState> & { contractName: string } = {
  contractName: "Davidson — 1620 Bay Rd contract.pdf",
  address: "1620 Bay Rd, #809",
  side: "buyer",
  client: "Davidson Family",
  closingDate: "2026-08-15",
  lender: "Bayshore Financial",
  loanOfficer: "Greg Linwood",
  title: "Pinnacle Title",
  tc: "Sofia Reyes",
  broker: "Coldwell — Maria Sandoval",
  inspector: "ProShield Inspections",
  appraiser: "Mendez & Co.",
};

export function NewTransactionClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [extractStatus, setExtractStatus] = useState<ExtractStatus>("idle");
  const [contractName, setContractName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function simulateUpload(name?: string) {
    setContractName(name ?? SIMULATED_EXTRACTION.contractName);
    setExtractStatus("extracting");
    window.setTimeout(() => {
      setForm((f) => ({
        ...f,
        address: SIMULATED_EXTRACTION.address ?? f.address,
        side: SIMULATED_EXTRACTION.side ?? f.side,
        client: SIMULATED_EXTRACTION.client ?? f.client,
        closingDate: SIMULATED_EXTRACTION.closingDate ?? f.closingDate,
        lender: SIMULATED_EXTRACTION.lender ?? f.lender,
        loanOfficer:
          SIMULATED_EXTRACTION.loanOfficer ?? f.loanOfficer,
        title: SIMULATED_EXTRACTION.title ?? f.title,
        tc: SIMULATED_EXTRACTION.tc ?? f.tc,
        broker: SIMULATED_EXTRACTION.broker ?? f.broker,
        inspector: SIMULATED_EXTRACTION.inspector ?? f.inspector,
        appraiser: SIMULATED_EXTRACTION.appraiser ?? f.appraiser,
      }));
      setExtractStatus("extracted");
    }, 1500);
  }

  function clearUpload() {
    setContractName(null);
    setExtractStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // No backend yet — just visit the list so the user sees the flow finish.
    window.setTimeout(() => router.push("/transactions"), 400);
  }

  const canSave = form.address.trim() !== "" && form.client.trim() !== "";

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[720px] mx-auto space-y-8">
      <Link
        href="/transactions"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        All transactions
      </Link>

      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          New transaction
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Upload a contract and Pulsor fills the rest, or enter details manually.
        </p>
      </header>

      <ContractUpload
        status={extractStatus}
        contractName={contractName}
        fileInputRef={fileInputRef}
        onUpload={simulateUpload}
        onClear={clearUpload}
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-6"
      >
        <Field label="Property address" required>
          <Input
            value={form.address}
            onChange={(e) => patch("address", e.target.value)}
            placeholder="123 Brickell Ave, #1204"
            required
          />
        </Field>

        <Field label="Side">
          <SideToggle value={form.side} onChange={(v) => patch("side", v)} />
        </Field>

        <Field label="Client" required>
          <Input
            value={form.client}
            onChange={(e) => patch("client", e.target.value)}
            placeholder={form.side === "buyer" ? "Buyer name" : "Seller name"}
            required
          />
        </Field>

        <Field label="Expected closing date">
          <Input
            type="date"
            value={form.closingDate}
            onChange={(e) => patch("closingDate", e.target.value)}
          />
        </Field>

        <div className="pt-2 space-y-5">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85">
            Team & service providers
          </div>
          <div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">
            <Field label="Lender">
              <Input
                value={form.lender}
                onChange={(e) => patch("lender", e.target.value)}
                placeholder="Bank or mortgage co."
              />
            </Field>
            <Field label="Loan officer">
              <Input
                value={form.loanOfficer}
                onChange={(e) => patch("loanOfficer", e.target.value)}
                placeholder="Loan officer contact"
              />
            </Field>
            <Field label="Title company">
              <Input
                value={form.title}
                onChange={(e) => patch("title", e.target.value)}
                placeholder="Title agent or escrow"
              />
            </Field>
            <Field label="TC assigned">
              <Input
                value={form.tc}
                onChange={(e) => patch("tc", e.target.value)}
                placeholder="Transaction coordinator"
              />
            </Field>
            <Field label="Broker / co-broker">
              <Input
                value={form.broker}
                onChange={(e) => patch("broker", e.target.value)}
                placeholder="Other-side agent / brokerage"
              />
            </Field>
            <Field label="Inspector">
              <Input
                value={form.inspector}
                onChange={(e) => patch("inspector", e.target.value)}
                placeholder="Home inspector"
              />
            </Field>
            <Field label="Appraiser">
              <Input
                value={form.appraiser}
                onChange={(e) => patch("appraiser", e.target.value)}
                placeholder="Appraisal company"
              />
            </Field>
            <Field label="Photographer">
              <Input
                value={form.photographer}
                onChange={(e) => patch("photographer", e.target.value)}
                placeholder="Listing photographer"
              />
            </Field>
            <Field label="Stager">
              <Input
                value={form.stager}
                onChange={(e) => patch("stager", e.target.value)}
                placeholder="Staging company"
              />
            </Field>
            <Field label="Mover">
              <Input
                value={form.mover}
                onChange={(e) => patch("mover", e.target.value)}
                placeholder="Moving company"
              />
            </Field>
            <Field label="HOA contact">
              <Input
                value={form.hoa}
                onChange={(e) => patch("hoa", e.target.value)}
                placeholder="HOA or property mgmt"
              />
            </Field>
            <Field label="Utilities">
              <Input
                value={form.utilities}
                onChange={(e) => patch("utilities", e.target.value)}
                placeholder="Power, water, internet"
              />
            </Field>
          </div>
        </div>

        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={(e) => patch("notes", e.target.value)}
            placeholder="Anything Pulsor should know about this deal."
            rows={4}
            className={cn(
              "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm",
              "outline-none transition-colors placeholder:text-muted-foreground",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "resize-y leading-relaxed"
            )}
          />
        </Field>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
          <button
            type="submit"
            disabled={!canSave || saving}
            className={cn(
              "flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 min-w-[160px] px-4 py-2 rounded-md text-sm font-medium transition-colors",
              "bg-foreground text-background hover:bg-foreground/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {saving ? (
              <>
                <Loader2
                  className="h-3.5 w-3.5 animate-spin"
                  strokeWidth={2}
                />
                Saving…
              </>
            ) : (
              "Save transaction"
            )}
          </button>
          <Link
            href="/transactions"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium border border-border text-foreground hover:bg-muted/60 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function ContractUpload({
  status,
  contractName,
  fileInputRef,
  onUpload,
  onClear,
}: {
  status: ExtractStatus;
  contractName: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onUpload: (name?: string) => void;
  onClear: () => void;
}) {
  function handlePick() {
    fileInputRef.current?.click();
  }
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    onUpload(file?.name);
  }

  if (status === "idle") {
    return (
      <button
        type="button"
        onClick={handlePick}
        className="group w-full flex items-center gap-3 px-4 py-4 sm:px-5 rounded-xl border border-dashed border-border bg-card/60 hover:border-foreground/40 hover:bg-card transition-colors text-left"
      >
        <Upload
          className="h-4 w-4 text-muted-foreground shrink-0"
          strokeWidth={1.75}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            Upload contract to auto-fill
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pulsor extracts parties, address, closing date, lender, and
            deadlines.
          </p>
        </div>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85 shrink-0 hidden sm:inline">
          PDF · DOCX
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFile}
          className="hidden"
        />
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3.5 sm:px-5">
      <div className="flex items-center gap-3">
        <FileText
          className="h-4 w-4 text-muted-foreground shrink-0"
          strokeWidth={1.75}
        />
        <span className="text-sm text-foreground flex-1 min-w-0 truncate">
          {contractName ?? "Contract"}
        </span>
        {status === "extracting" ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
            Extracting
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-success">
            <Sparkles
              className="h-3 w-3"
              strokeWidth={2}
              fill="currentColor"
            />
            Extracted
          </span>
        )}
        <button
          type="button"
          aria-label="Remove contract"
          onClick={onClear}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors shrink-0"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
      {status === "extracted" && (
        <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed pl-7">
          Filled the form below with what we read. Review and tweak anything
          that needs a second look.
        </p>
      )}
    </div>
  );
}

function SideToggle({
  value,
  onChange,
}: {
  value: Side;
  onChange: (next: Side) => void;
}) {
  const options: { key: Side; label: string }[] = [
    { key: "buyer", label: "Buyer" },
    { key: "seller", label: "Seller" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Transaction side"
      className="inline-flex items-center rounded-md border border-border bg-card p-0.5"
    >
      {options.map(({ key, label }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(key)}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </div>
      {children}
    </div>
  );
}
