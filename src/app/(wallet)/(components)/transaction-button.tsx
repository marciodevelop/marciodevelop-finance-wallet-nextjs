import { ComponentProps } from "react";
import * as Icon from "lucide-react";

interface TransactionButtonProps extends ComponentProps<"button"> {
  icon: "ArrowUpCircleIcon" | "ArrowDownCircleIcon";
  title: string;
}

export function TransactionButton(props: TransactionButtonProps) {
  const { icon, title, ...rest } = props;

  const IconComponent = Icon[icon];

  return (
    <button
      className={`${
        icon === "ArrowDownCircleIcon"
          ? "bg-green-50 hover:bg-green-100"
          : "bg-orange-50 hover:bg-orange-100"
      } relative flex p-2 items-center justify-center rounded-xl w-full h-[50px] border border-green-30 transition-all duration-500`}
      {...rest}
    >
      <IconComponent
        size={22}
        className="absolute top-2 left-2 text-rose-400"
      />
      <span className="text-rose-400 font-semibold text-lg">{title}</span>
    </button>
  );
}
