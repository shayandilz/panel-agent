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
import {DateObject} from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"

export function toFarsiNumber(n: any) {
    if (n) {
        const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
        return n.toString().replace(/\d/g, (x: any) => farsiDigits[x]);
    } else return "";
}

/* eslint-disable */
export function getPersianDate() {
    let options: any = {month: 'long', day: 'numeric', weekday: 'long'};
    let today = new Date().toLocaleDateString('fa-IR', options);
    return today;
}

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

export const menuItems = [
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

]


var persianNumber = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
];
var arabicNumber = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

export function fixNumbers(str: any) {
    if (typeof str === "string") {
        for (var i = 0; i < 10; i++) {
            str = str.replace(persianNumber[i], i).replace(arabicNumber[i], i);
        }
    }
    return str;
}

export function numberWithCommas(x: any) {
    x = x?.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
}

export function parsePersianDate(dateString: any) {
    if (dateString) {
        const [year, month, day] = dateString?.split("/").map(Number);
        return new DateObject({
            calendar: persian,
            year: year,
            month: month,
            day: day
        });

    }
}

export function calculateTimestamp(timestamp: any) {
    return timestamp ? new Date(Number(timestamp) * 1000).toLocaleDateString('fa-IR') : 'نا مشخص'
}

export const planTypeList = [
    {title: "زندگی و سرمایه گذاری", value: "Universal", link: "/inquery-update"},
    {title: " زندگی متصل به صندوق های بازار سرمایه", value: "UniversalUnitlink", link: "/unitlink-update"},
    {title: " زندگی و مسکن (مسکن متری) ", value: "UniversalHousing", link: "/universal-update"},
]


export const InvestmentPercentage = (item: any) => {
    return ((item?.units_all - item?.remain_units) / item?.units_all) * 100
}
export const soldierStatus = [
    {value: "Not Done", title: "انجام ندادم"},
    {value: "Done", title: "انجام دادم"},
    {value: "Medical exemption", title: "معافیت پزشکی"},
    {value: "Non-medical exemption", title: "معافیت غیر پزشکی"},
    {value: "Serving", title: "در حال انجام"},
]


export function showPercentTitle(percent: any): string {
    const percentNumber = Number(percent);

    if (percentNumber > 100) {
        switch (percentNumber) {
            case 101:
                return "به میزان طلب از بیمه‌نامه";
            case 102:
                return "سرمایه‌پس از کسر مبلغ بدهکاری";
            default:
                return "";
        }
    }

    return percent.toString();
}