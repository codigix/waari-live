const coupons = [
  {
    couponId: 1,
    couponName: "WELCOME100",
    fromDate: "2025-01-01",
    toDate: "2025-12-31",
    isType: 1,
    discountType: 2,
    discountValue: 10,
    maxDiscount: 5000,
    status: 1,
  },
  {
    couponId: 2,
    couponName: "LOYALTY2500",
    fromDate: "2025-03-01",
    toDate: "2025-12-31",
    isType: 1,
    discountType: 1,
    discountValue: 2500,
    maxDiscount: null,
    status: 1,
  },
  {
    couponId: 3,
    couponName: "NEWWAARI750",
    fromDate: "2025-01-15",
    toDate: "2025-06-30",
    isType: 2,
    discountType: 2,
    discountValue: 7.5,
    maxDiscount: 3000,
    status: 0,
  },
  {
    couponId: 4,
    couponName: "SUMMERFIX1500",
    fromDate: "2025-04-01",
    toDate: "2025-07-31",
    isType: 1,
    discountType: 1,
    discountValue: 1500,
    maxDiscount: null,
    status: 1,
  },
  {
    couponId: 5,
    couponName: "FAMILYDEAL12",
    fromDate: "2025-05-10",
    toDate: "2025-09-30",
    isType: 1,
    discountType: 2,
    discountValue: 12,
    maxDiscount: 4500,
    status: 0,
  },
  {
    couponId: 6,
    couponName: "REFERFRIEND1000",
    fromDate: "2025-02-01",
    toDate: "2025-12-31",
    isType: 1,
    discountType: 1,
    discountValue: 1000,
    maxDiscount: null,
    status: 1,
  },
  {
    couponId: 7,
    couponName: "WINTERBONUS15",
    fromDate: "2025-10-01",
    toDate: "2026-01-15",
    isType: 1,
    discountType: 2,
    discountValue: 15,
    maxDiscount: 6000,
    status: 1,
  },
  {
    couponId: 8,
    couponName: "TAILORCT5000",
    fromDate: "2025-03-25",
    toDate: "2025-11-30",
    isType: 2,
    discountType: 1,
    discountValue: 5000,
    maxDiscount: null,
    status: 0,
  },
];

const cloneValue = (value) => JSON.parse(JSON.stringify(value));

const toPositiveInt = (value, fallback = null) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const sanitizeText = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const text = String(value).trim();
  return text || fallback;
};

const formatDateOnly = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().slice(0, 10);
};

const resolveDateInput = (value, fallback) => formatDateOnly(value) || formatDateOnly(fallback) || null;

let couponSequence = coupons.reduce(
  (max, coupon) => Math.max(max, Number(coupon && coupon.couponId) || 0),
  coupons.length
);

const nextCouponId = () => {
  couponSequence += 1;
  return couponSequence;
};

const normalizeCouponRecord = (payload, fallbackId) => {
  const couponId = toPositiveInt(payload.couponId, fallbackId) || fallbackId;
  const fromDate = resolveDateInput(payload.fromDate ?? payload.validFrom, new Date());
  const toDate = resolveDateInput(payload.toDate ?? payload.validTo, fromDate);
  const discountType = Number(payload.discountType) === 2 ? 2 : 1;
  const discountValue = toNumber(payload.discountValue, 0);
  const isType = Number(payload.isType) === 2 ? 2 : 1;
  const status = Number(payload.status) === 1 ? 1 : 0;
  const maxDiscountValue =
    discountType === 2 ? toNumber(payload.maxDiscount ?? payload.max_discount, 0) : null;
  return {
    couponId,
    couponName: sanitizeText(payload.couponName, `COUPON${couponId}`),
    fromDate: fromDate || "",
    toDate: toDate || fromDate || "",
    isType,
    discountType,
    discountValue,
    maxDiscount: maxDiscountValue,
    status,
  };
};

const paginate = (items, page, perPage) => {
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const sanitizedPage = Math.min(Math.max(page, 1), lastPage);
  const offset = (sanitizedPage - 1) * perPage;
  return {
    data: items.slice(offset, offset + perPage),
    total,
    perPage,
    page: sanitizedPage,
    lastPage,
  };
};

const listCoupons = ({ page, perPage }) => paginate(coupons, page, perPage);

const updateCouponStatus = ({ couponId, status }) => {
  const index = coupons.findIndex((coupon) => coupon.couponId === couponId);
  if (index === -1) {
    return false;
  }
  coupons[index].status = status ? 1 : 0;
  return true;
};

const addCoupon = (payload = {}) => {
  const couponId = nextCouponId();
  const record = normalizeCouponRecord({ ...payload, couponId }, couponId);
  coupons.push(record);
  return { data: cloneValue(record), message: "Coupon added successfully" };
};

module.exports = {
  listCoupons,
  updateCouponStatus,
  addCoupon,
};
