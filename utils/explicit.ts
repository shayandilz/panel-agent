// Explicit field mapping: map API param names to specific detail keys
export const explicitFieldMap: Record<string, string | string[]> = {
    'thirdparty?command=get_coverage': 'thirdparty_coverage_desc',
    'company?command=get_company2': ['company_name', 'thirdparty_lastcompany_name'],
    'thirdparty?command=get_usefor': 'thirdparty_usefor_id',
    'thirdparty?command=get_time': 'thirdparty_time_id',
    'bodycar?command=get_coverage': 'body.bodycar_coverage_id',
    'bodycar?command=get_bodycar_discntlife': 'bodycar_discnt_life_company_name',
    'firehome?command=get_firehome_coverage': 'body.firehome_coverage_id',
    'responsdoctors?command=get_responsdoctors_doctorLevel': 'responsdoctors_doctor_level_name',
    'resbuildmng?command=get_yearofcons': 'resbuildmng_buildinglife_name',
    'resbuildmng?command=get_resbuildmng_coverage': 'body.resbuildmng_coverage_id',
    'ABN?command=get_atonement_person': 'ABN_atonement_person_value',
    'BossToEmployee?command=get_person_quantity': 'boss_to_employee_person_number_name',
    'BossToEmployee?command=get_coverage': 'body.boss_to_employee_coverage_id',
    'BossToEmployee?command=get_discount': 'boss_to_employee_discount_id',
    'buildingquality?command=get_floors': 'floor_name',
    'accident?command=get_accident_side_coverage': 'body.accident_side_coverage_id',
    'car?command=get_carcompany': 'car_company_name',
    'thirdparty_last_date_start': 'thirdparty_last_date_sart',

    // add more mappings here: apiFieldName: detailKey
};