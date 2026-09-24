export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20">
      {message}
    </div>
  );
}

export function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
      {message}
    </div>
  );
}
