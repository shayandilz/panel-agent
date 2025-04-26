// import {
//     BillCheck2,
//     CardTransfer,
//     Folder,
//     LetterUnread,
//     Messagequestion,
//     OfferFolder,
//     Peyment,
//     StatusUp,
//     Wiki,
//     Inquery1,
//     Inquery2,
//     Inquery3
// } from "../assets";
// import routes from "./routes";
// import {DateObject} from 'react-multi-date-picker';
// import persian from "react-date-object/calendars/persian"

// export function toFarsiNumber(n: any) {
//     if (n) {
//         const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
//         return n.toString().replace(/\d/g, (x: any) => farsiDigits[x]);
//     } else return "";
// }

/* eslint-disable */
// export function getPersianDate() {
//     let options: any = {month: 'long', day: 'numeric', weekday: 'long'};
//     let today = new Date().toLocaleDateString('fa-IR', options);
//     return today;
// }

// export function policyIcon(name: any) {
//     switch (name) {
//         case "universal" :
//             return Inquery1;
//         case "UniversalFound" :
//             return Inquery2;
//         case "UniversalHousing" :
//             return Inquery3;
//         default:
//             return Inquery1;
//     }
// }

// export const menuItems = [
// {name: "س  ", path :`${routes.DASHBOARD}`, type:'shallow' , icon:<Dashboard/> },
// {
//         name: 'استعلام',
//         type: 'nested',
//         icon:<Messagequestion/>,
//         items:[
//                 {name: ' استعلام حق بیمه  ', path:`${routes.INSURANCERATE}`},
//                 {name: 'استعلام با کد ملی'},
//                 {name: 'استعلام با نام بیمه گذار'}

//             ]
//         },
// {name: ' استعلام حق بیمه  ', path: `${routes.INSURANCERATE}`, type: 'shallow', icon: <StatusUp/>},
//
// {name: "بیمه نامه  ", path: `${routes.INSURANCEPOLICY}`, type: 'shallow', icon: <Folder/>},
// {name: "پیشنهاد بیمه نامه  ", path: `${routes.OFFERSLIST}`, type: 'shallow', icon: <OfferFolder/>},
// {name: "اقساط سررسیده شده", path: `${routes.INSTALLMENT}`, type: 'shallow', icon: <CardTransfer/>},
// {name: "تراکنش ها  ", path: `${routes.TRANSACTIONS}`, type: 'shallow', icon: <Peyment/>},
// {name: "کارمزد", path: `${routes.COMMISSION}`, type: 'shallow', icon: <BillCheck2/>},
// {name: " مشاوره ها ", path: `${routes.CONSULTATION}`, type: 'shallow', icon: <LetterUnread/>},
// {name: " سامانه تیکت ", path :`${routes.Ticketing}`, type:'shallow', icon:<Messagequestion/>},
// {name: "آموزش", path: `${routes.TOTURIAL}`, type: 'shallow', icon: <Wiki/>},
// {name: "سوالات متداول", path: `${routes.FAQ}`, type: 'shallow', icon: <Messagequestion/>},
// {name: "تنظیمات", path :'/consultation-request', type:'shallow',icon:<Settings/>},

// ]

// var persianNumber = [
//     /۰/g,
//     /۱/g,
//     /۲/g,
//     /۳/g,
//     /۴/g,
//     /۵/g,
//     /۶/g,
//     /۷/g,
//     /۸/g,
//     /۹/g,
// ];
// var arabicNumber = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

// export function fixNumbers(str: any) {
//     if (typeof str === "string") {
//         for (var i = 0; i < 10; i++) {
//             str = str.replace(persianNumber[i], i).replace(arabicNumber[i], i);
//         }
//     }
//     return str;
// }

// export function numberWithCommas(x: any) {
//     x = x?.toString();
//     var pattern = /(-?\d+)(\d{3})/;
//     while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
//     return x;
// }

// export function parsePersianDate(dateString: any) {
//     if (dateString) {
//         const [year, month, day] = dateString?.split("/").map(Number);
//         return new DateObject({
//             calendar: persian,
//             year: year,
//             month: month,
//             day: day
//         });
//
//     }
// }

export function calculateTimestamp(timestamp: any) {
    return timestamp ? new Date(timestamp).toLocaleDateString('fa-IR') : 'نا مشخص'
}

// export const planTypeList = [
//     {title: "زندگی و سرمایه گذاری", value: "Universal", link: "/inquery-update"},
//     {title: " زندگی متصل به صندوق های بازار سرمایه", value: "UniversalUnitlink", link: "/unitlink-update"},
//     {title: " زندگی و مسکن (مسکن متری) ", value: "UniversalHousing", link: "/universal-update"},
// ]

export const requestStepData = {
    3: {
        command:'requestpending3',
        title: 'تغییر وضعیت درخواست به در حال بررسی',
        fields: []
    },
    4: {
        command:'requestbackuser4',
        title: 'برگشت سفارش به کاربر به علت مشکل ماهیتی',
        fields: [
            {
                name: "request_backuser_desc",
                label: "توضیحات",
                type: "textarea",
                required: true
            },
        ]
    },
    5: {
        command:'requestbackagent5',
        title: 'برگشت سفارش به نماینده دیگر',
        fields: [
            {
                name: "request_backagent_desc",
                label: "توضیحات",
                type: "textarea",
                required: true
            },
        ]
    },
    6: {
        command:'requestdepositdeficit6',
        title: 'اعلام کسری واریزی به کاربر',
        fields: [
            {
                name: "deficit_pey_amount",
                label: "میزان کسری",
                type: "number",
                required: true
            },
            {
                name: "deficit_pey_reason",
                label: "توضیحات",
                type: "textarea",
                required: true
            },
        ]
    },
    7: {
        command:'requestsuspend7',
        title: 'معلق برای تاریخ صدور',
        fields: [
            {
                name: "requst_suspend_end_date",
                label: "تاریخ",
                type: "date",
                required: true
            },
            {
                name: "requst_suspend_desc",
                label: "توضیحات",
                type: "textarea",
                required: true
            },
        ]
    },
    8: {
        command:'requestdifficult8',
        title: 'مشکل برای صدور به علت وجود مشکل در مشخضات',
        fields: [
            {
                name: "request_difficult_desc",
                label: "توضیحات",
                type: "textarea",
                required: true
            },
        ]
    },
    9: {
        command:'requestissuing9',
        title: 'وضعیت در حال صدور توسط نماینده',
        fields: [
            // {
            //     name: "request_difficult_desc",
            //     label: "توضیحات",
            //     type: "textarea",
            //     required: true
            // },
        ]
    },
    10: {
        command:'requestready10',
        title: 'وضعیت درخواست صادر شده و آماده تحویل',
        fields: [
            {
                name: "requst_ready_start_date",
                label: "تاریخ شروع بیمه نامه",
                type: "date",
            },
            {
                name: "requst_ready_end_date",
                label: "تاریخ پایان بیمه نامه",
                type: "date",
            },
            {
                name: "requst_ready_end_price",
                label: "قیمت نهایی",
                type: "number",
                required: true
            },
            {
                name: "requst_ready_num_ins",
                label: "َشماره بیمه نامه",
                type: "number",
                required: true
            },
            {
                name: "requst_suspend_desc",
                label: "توضیحات بیمه نامه",
                type: "textarea",
                required: true
            },
            {
                name: "requst_ready_code_yekta",
                label: "کد یکتا",
                type: "number",
                required: true
            },
            {
                name: "requst_ready_code_rayane",
                label: "کد رایانه",
                type: "number",
                required: true
            },
            {
                name: "requst_ready_code_penalty",
                label: "مبلغی که شامل کارمزد نمیشود ",
                type: "number",
                required: true
            },
            {
                name: "requst_ready_name_insurer",
                label: "نام بیمه گذار",
                type: "text",
                required: true
            },
            {
                name: "requst_ready_code_insurer",
                label: "کد ملی بیمه گذار",
                type: "number",
                required: true
            },
            {
                name: "request_ready_clearing_id",
                label: " نحوه تسویه",
                type: "select",
                command: "get_clearingmode",
                required: true
            },
        ]
    },
    11: {
        command:'',
        title: 'تغییر وضعیت به تحویل شده به کاربر',
        fields: [
            {
                name: "request_delivered_mode_id",
                label: "نوع دریافت",
                type: "select",
                required: true,
                command: "get_mode_delivery"
            },
            {
                name: "request_delivered_state_id",
                label: "استان",
                type: "select",
                command: "get_state",
                triggers: "get_city",
                triggerParam: "state_id"
            },
            {
                name: "request_delivered_city_id",
                label: "شهر",
                type: "select",
                command: "get_city",
                dependsOn: "request_delivered_state_id"
            },
            {
                name: "request_delivered_dsc",
                label: "توضیحات تحویل",
                type: "textarea",
                required: true
            },
            // {
            //     name: "price",
            //     label: "مبلغ",
            //     type: "number",
            //     required: true
            // },
            {
                name: "request_delivered_receipt_image_code",
                label: "تصاویر",
                type: "image",
                maxNumber: 1,
                required: true
            }
        ]
    },
    12: {
        command:'requestissuing12',
        title: 'استعلام قیمت توسط کاربر',
        fields: [
            // {
            //     name: "request_difficult_desc",
            //     label: "توضیحات",
            //     type: "textarea",
            //     required: true
            // },
        ]
    },
    13: {
        command:'requestissuing13',
        title: 'درخواست قیمت',
        fields: [
            // {
            //     name: "request_difficult_desc",
            //     label: "توضیحات",
            //     type: "textarea",
            //     required: true
            // },
        ]
    },
    14: {
        command:'requestissuing14',
        title: 'قیمت دهی به سفارش',
        fields: [
            // {
            //     name: "request_difficult_desc",
            //     label: "توضیحات",
            //     type: "textarea",
            //     required: true
            // },
        ]
    },
    15: {
        command:'requestissuing15',
        title: 'انصراف از قیمت دهی آفلاین',
        fields: [
            // {
            //     name: "request_difficult_desc",
            //     label: "توضیحات",
            //     type: "textarea",
            //     required: true
            // },
        ]
    },
    16: {
        command:'requestissuing16',
        title: 'وضعیت نیاز به بازدید',
        fields: [
            // {
            //     name: "request_difficult_desc",
            //     label: "توضیحات",
            //     type: "textarea",
            //     required: true
            // },
        ]
    },
}


// export function showPercentTitle(percent: any): string {
//     const percentNumber = Number(percent);
//
//     if (percentNumber > 100) {
//         switch (percentNumber) {
//             case 101:
//                 return "به میزان طلب از بیمه‌نامه";
//             case 102:
//                 return "سرمایه‌پس از کسر مبلغ بدهکاری";
//             default:
//                 return "";
//         }
//     }
//
//     return percent.toString();
// }