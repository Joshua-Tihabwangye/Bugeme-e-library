import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen, Clock, Calendar, Star, Crown, Check, CreditCard, Smartphone, Wallet, ArrowRight } from 'lucide-react';
// Payment method logos
const MobileMoneyLogo = () => (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-[8px]", children: "MTN" }) }), _jsx("div", { className: "h-6 w-6 rounded-full bg-red-500 flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-[6px]", children: "Airtel" }) })] }));
const VisaLogo = () => (_jsx("div", { className: "flex items-center justify-center rounded bg-[#1A1F71] px-2 py-1", children: _jsx("span", { className: "text-white font-bold text-xs", children: "VISA" }) }));
const PayPalLogo = () => (_jsxs("div", { className: "flex items-center justify-center rounded bg-[#003087] px-2 py-1", children: [_jsx("span", { className: "text-[#009CDE] font-bold text-xs", children: "Pay" }), _jsx("span", { className: "text-white font-bold text-xs", children: "Pal" })] }));
const SubscriptionPaywall = ({ isOpen, onClose, actionBlocked = 'access this feature' }) => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [mobileMoneyProvider, setMobileMoneyProvider] = useState('MTN');
    if (!isOpen)
        return null;
    const plans = [
        { id: 1, name: 'Hourly', price: 2000, icon: Clock },
        { id: 2, name: 'Weekly', price: 15000, icon: Calendar },
        { id: 3, name: 'Monthly', price: 40000, icon: Star, popular: true },
        { id: 4, name: 'Yearly', price: 300000, icon: Crown },
    ];
    const paymentMethods = [
        {
            id: 'mobile-money',
            name: 'Mobile Money',
            subtitle: 'MTN MoMo or Airtel Money',
            icon: Smartphone,
            color: 'text-yellow-600',
            bg: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10',
            border: 'border-yellow-200 dark:border-yellow-500/30',
        },
        {
            id: 'card',
            name: 'Card Payment',
            subtitle: 'Visa or MasterCard',
            icon: CreditCard,
            color: 'text-blue-600',
            bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10',
            border: 'border-blue-200 dark:border-blue-500/30',
        },
        {
            id: 'paypal',
            name: 'PayPal',
            subtitle: 'Pay with PayPal account',
            icon: Wallet,
            color: 'text-sky-600',
            bg: 'bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-500/10 dark:to-cyan-500/10',
            border: 'border-sky-200 dark:border-sky-500/30',
        },
    ];
    const handleSelectPlan = (planId) => {
        setSelectedPlan(planId);
    };
    const handleSelectPaymentMethod = (methodId) => {
        setSelectedPaymentMethod(methodId);
    };
    const handleProceedPayment = () => {
        if (!selectedPlan || !selectedPaymentMethod)
            return;
        onClose();
        const methodPath = selectedPaymentMethod === 'mobile-money'
            ? `${selectedPaymentMethod}/${mobileMoneyProvider.toLowerCase()}`
            : selectedPaymentMethod;
        navigate(`/subscription/payment/${selectedPlan}/${methodPath}`);
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto", children: _jsxs("div", { className: "relative w-full max-w-3xl animate-in rounded-2xl bg-white shadow-2xl dark:bg-slate-900 my-4", children: [_jsx("button", { onClick: onClose, className: "absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10", children: _jsx(X, { className: "h-5 w-5" }) }), _jsxs("div", { className: "bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-6 text-center text-white rounded-t-2xl", children: [_jsx("div", { className: "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20", children: _jsx(BookOpen, { className: "h-7 w-7" }) }), _jsx("h2", { className: "text-2xl font-bold", children: "Subscribe to Continue" }), _jsxs("p", { className: "mt-1 text-brand-100", children: [_jsx("span", { className: "font-medium", children: "Subscription required" }), " to ", actionBlocked] })] }), _jsxs("div", { className: "p-6 grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-slate-900 dark:text-white mb-3", children: "What you'll get:" }), _jsx("ul", { className: "space-y-2", children: [
                                                'Unlimited access to all books',
                                                'Read anywhere, anytime',
                                                'Highlights and notes',
                                            ].map((feature, i) => (_jsxs("li", { className: "flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400", children: [_jsx(Check, { className: "h-4 w-4 text-emerald-500 shrink-0" }), feature] }, i))) })] }), _jsxs("div", { className: "pt-4 border-t border-slate-200 dark:border-white/10", children: [_jsx("h3", { className: "font-semibold text-slate-900 dark:text-white mb-3", children: "Payment Methods:" }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10", children: [_jsx(MobileMoneyLogo, {}), _jsx("span", { className: "text-xs text-slate-600 dark:text-slate-400", children: "Mobile Money" })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10", children: [_jsx(VisaLogo, {}), _jsx("span", { className: "text-xs text-slate-600 dark:text-slate-400", children: "Card" })] }), _jsx("div", { className: "flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10", children: _jsx(PayPalLogo, {}) })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-slate-900 dark:text-white mb-3", children: "Choose a Plan:" }), _jsx("div", { className: "space-y-2", children: plans.map((plan) => {
                                                const Icon = plan.icon;
                                                const isSelected = selectedPlan === plan.id;
                                                return (_jsxs("button", { onClick: () => handleSelectPlan(plan.id), className: `relative w-full flex items-center gap-3 rounded-xl border-2 p-3 transition-all hover:scale-[1.01] ${isSelected
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20'
                                                        : plan.popular
                                                            ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10'
                                                            : 'border-slate-200 bg-white hover:border-brand-300 dark:border-white/10 dark:bg-slate-800'}`, children: [plan.popular && (_jsx("div", { className: "absolute -top-2 right-3 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white", children: "POPULAR" })), _jsx("div", { className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isSelected ? 'bg-blue-500/20 text-blue-600' : plan.popular ? 'bg-amber-500/20 text-amber-600' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`, children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsx("div", { className: "flex-1 text-left", children: _jsx("p", { className: `font-semibold text-sm ${isSelected ? 'text-blue-700 dark:text-blue-400' : plan.popular ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`, children: plan.name }) }), _jsxs("p", { className: `font-bold ${isSelected ? 'text-blue-600' : plan.popular ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`, children: ["UGX ", plan.price.toLocaleString()] }), isSelected && _jsx(Check, { className: "h-5 w-5 text-blue-600" })] }, plan.id));
                                            }) })] }), selectedPlan && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-slate-900 dark:text-white mb-3", children: "Select Payment Method:" }), _jsx("div", { className: "space-y-2", children: paymentMethods.map((method) => {
                                                const Icon = method.icon;
                                                const isSelected = selectedPaymentMethod === method.id;
                                                return (_jsxs("div", { children: [_jsxs("button", { onClick: () => handleSelectPaymentMethod(method.id), className: `w-full flex items-center gap-4 rounded-xl border-2 p-3 transition-all hover:scale-[1.01] ${isSelected
                                                                ? `${method.border} ${method.bg} border-blue-500`
                                                                : `${method.border} ${method.bg}`}`, children: [_jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800 ${method.color}`, children: _jsx(Icon, { size: 20 }) }), _jsxs("div", { className: "flex-1 text-left", children: [_jsx("p", { className: "font-semibold text-slate-900 dark:text-white", children: method.name }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: method.subtitle })] }), isSelected && _jsx(Check, { className: "h-5 w-5 text-blue-600" })] }), isSelected && method.id === 'mobile-money' && (_jsxs("div", { className: "mt-2 ml-14", children: [_jsx("label", { className: "block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1", children: "Select Provider:" }), _jsxs("select", { value: mobileMoneyProvider, onChange: (e) => setMobileMoneyProvider(e.target.value), className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-800 dark:text-white", children: [_jsx("option", { value: "MTN", children: "MTN Mobile Money" }), _jsx("option", { value: "Airtel", children: "Airtel Money" })] })] }))] }, method.id));
                                            }) })] })), selectedPlan && selectedPaymentMethod && (_jsxs("button", { onClick: handleProceedPayment, className: "w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-white font-semibold transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg flex items-center justify-center gap-2", children: ["Proceed to Payment", _jsx(ArrowRight, { className: "h-5 w-5" })] }))] })] }), _jsx("div", { className: "border-t border-slate-200 dark:border-white/10 px-6 py-3 text-center", children: _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Secure payment \u2022 Instant access \u2022 Cancel anytime" }) })] }) }));
};
export default SubscriptionPaywall;
