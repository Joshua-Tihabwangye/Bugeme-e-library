import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Smartphone, Wallet, ArrowRight, ArrowLeft, Shield, } from "lucide-react";
import { getPlans } from "../../../lib/api/subscriptions";
import LoadingOverlay from "../../../components/feedback/LoadingOverlay";
const SubscriptionPaymentPage = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    // Fetch plan details to show amount
    const { data: plans, isLoading, isError, } = useQuery({
        queryKey: ["subscription-plans"],
        queryFn: getPlans,
    });
    // Ensure plans is always an array
    const plansArray = Array.isArray(plans) ? plans : [];
    const plan = plansArray.find((p) => p.id === Number(planId));
    const methods = [
        {
            id: "mobile-money",
            name: "Mobile Money",
            subtitle: "MTN MoMo or Airtel Money",
            icon: Smartphone,
            color: "text-yellow-600",
            bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10",
            border: "border-yellow-200 dark:border-yellow-500/30",
            route: `/subscription/payment/${planId}/mobile-money`,
        },
        {
            id: "card",
            name: "Card Payment",
            subtitle: "Visa or MasterCard",
            icon: CreditCard,
            color: "text-blue-600",
            bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10",
            border: "border-blue-200 dark:border-blue-500/30",
            route: `/subscription/payment/${planId}/card`,
        },
        {
            id: "paypal",
            name: "PayPal",
            subtitle: "Pay with PayPal account",
            icon: Wallet,
            color: "text-sky-600",
            bg: "bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-500/10 dark:to-cyan-500/10",
            border: "border-sky-200 dark:border-sky-500/30",
            route: `/subscription/payment/${planId}/paypal`,
        },
    ];
    if (isLoading) {
        return _jsx(LoadingOverlay, { label: "Loading payment options" });
    }
    if (isError || !plan) {
        return (_jsx("div", { className: "mx-auto max-w-lg space-y-6 py-8 animate-in", children: _jsxs("div", { className: "flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center", children: [_jsx("div", { className: "rounded-full bg-rose-100 p-6 dark:bg-rose-500/10", children: _jsx(Shield, { className: "h-16 w-16 text-rose-600 dark:text-rose-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Plan Not Found" }), _jsx("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: isError
                                    ? "Failed to load subscription plans. Please try again."
                                    : "The selected plan could not be found." })] }), _jsxs(Link, { to: "/subscription/plans", className: "btn-primary", children: [_jsx(ArrowLeft, { className: "h-5 w-5" }), "Back to Plans"] })] }) }));
    }
    return (_jsxs("div", { className: "mx-auto max-w-lg space-y-6 py-8 animate-in", children: [_jsxs(Link, { to: "/subscription/plans", className: "inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to plans"] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600", children: _jsx(Shield, { className: "h-7 w-7 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Secure Payment" }), _jsx("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: "Choose your preferred payment method" })] }), _jsx("div", { className: "rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-800", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Selected Plan" }), _jsx("p", { className: "font-semibold text-slate-900 dark:text-white", children: plan?.name || "Subscription Plan" })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Amount" }), _jsxs("p", { className: "text-lg font-bold text-brand-600 dark:text-brand-400", children: ["UGX", " ", plan ? Number(plan.price).toLocaleString() : "---"] })] })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: "Select Payment Method" }), methods.map((method) => (_jsxs("button", { onClick: () => navigate(method.route), className: `flex w-full items-center gap-4 rounded-xl border ${method.border} ${method.bg} p-4 transition-all hover:scale-[1.01] hover:shadow-md`, children: [_jsx("div", { className: `flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800 ${method.color}`, children: _jsx(method.icon, { size: 24 }) }), _jsxs("div", { className: "flex-1 text-left", children: [_jsx("p", { className: "font-semibold text-slate-900 dark:text-white", children: method.name }), _jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: method.subtitle })] }), _jsx(ArrowRight, { className: "h-5 w-5 text-slate-400" })] }, method.id)))] }), _jsxs("div", { className: "flex items-center justify-center gap-4 pt-4 text-xs text-slate-500 dark:text-slate-400", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Shield, { className: "h-3 w-3" }), "Secure Payment"] }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "256-bit SSL" }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "Instant Access" })] })] }));
};
export default SubscriptionPaymentPage;
