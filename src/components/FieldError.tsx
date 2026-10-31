type FieldErrorProps = {
  messages?: string[];
};

export default function FieldError({ messages }: FieldErrorProps) {
  if (!messages?.length) {
    return null;
  }

  return <p className="text-sm text-red-400">{messages.join(" ")}</p>;
}
