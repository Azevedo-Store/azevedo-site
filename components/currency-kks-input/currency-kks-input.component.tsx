import { CurrencyKks } from "@/types/CurrencyKks.types";
import { Minus, Plus, Coins } from 'lucide-react';
import { useTranslations } from "next-intl";
export default function CurrencyKksInput({ increment, decrement, value }: CurrencyKks) {
      const t_buy_without_limit = useTranslations('buy_without_limit');
    
    function formatNumber(value: number): string {
        if (value >= 1_000_000_000) return `${value / 1_000_000_000} B`;
        if (value >= 1_000_000) return `${value / 1_000_000} kk`;
        return value.toString();
    }

    return (
        <div className="space-y-2 w-full">
            <label className="text-sm font-medium text-gray-700">{t_buy_without_limit("add_quantity")}</label>

            {/* Main +/- buttons */}
            <div className="flex items-center space-x-2 border rounded-md px-8 py-2">
                <div className="flex flex-col sm:flex-row gap-1">
                    {/* <button
                        onClick={() => decrement(1_000_000_000)}
                        className="bg-th-blue text-white px-1 py-1 rounded hover:bg-gray-700"
                    >
                        -1B
                    </button> */}
                    <button
                        onClick={() => decrement(100_000_000)}
                        className="bg-th-blue text-white px-1 py-1 rounded hover:bg-gray-700"
                    >
                        -100KK
                    </button>
                </div>
                <div className="flex gap-1 flex-col sm:flex-row items-center">
                    <button
                        onClick={() => decrement(10_000_000)}
                        className="bg-th-blue text-white px-1 py-1 rounded hover:bg-gray-700"
                    >
                        -10KK
                    </button>

                </div>
                <button
                    onClick={() => decrement(1_000_000)}
                    className="bg-th-blue text-white px-1 py-1 rounded hover:bg-gray-700"
                >
                    <Minus size={16} />
                </button>
                <span className="w-full text-center text-lg font-semibold">{formatNumber(value)}</span>
                <button
                    onClick={() => increment(1_000_000)}
                    className="bg-th-blue text-white px-1 py-1 rounded hover:bg-gray-700"
                >
                    <Plus size={16} />
                </button>
                <div className="flex gap-1 flex-col sm:flex-row items-center">

                    <button
                        onClick={() => increment(10_000_000)}
                        className="bg-th-blue text-white px-1 py-1 rounded hover:bg-gray-700"
                    >
                        +10KK
                    </button>
                </div>
                <div className="flex gap-1 flex-col sm:flex-row">
                    <button
                        onClick={() => increment(100_000_000)}
                        className="bg-th-blue text-white px-1 py-1 rounded hover:bg-gray-700"
                    >
                        +100KK
                    </button>
                    {/* <button
                        onClick={() => increment(1_000_000_000)}
                        className="bg-th-blue text-white px-1 py-1 rounded hover:bg-gray-700"
                    >
                        +1B
                    </button> */}
                </div>
            </div>

        </div >
    );
}