export default function PricingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Pricing</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Starter</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ideal for exploring models.</p>
          <p className="mt-4 text-2xl font-bold">$9/mo</p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Pro</h2>
          <p className="mt-2 text-sm text-muted-foreground">For creators and teams.</p>
          <p className="mt-4 text-2xl font-bold">$29/mo</p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Enterprise</h2>
          <p className="mt-2 text-sm text-muted-foreground">Scale with priority support.</p>
          <p className="mt-4 text-2xl font-bold">Contact</p>
        </div>
      </div>
    </div>
  );
}