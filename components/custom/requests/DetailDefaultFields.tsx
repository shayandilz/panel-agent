'use client';

import React, {useEffect, useState} from 'react';
import {explicitFieldMap} from "@/utils/explicit";
interface InputsSummaryProps {
    details?: any;
}



const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
};

const InputsSummary: React.FC<InputsSummaryProps> = ({details}) => {
    const [steps, setSteps] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetching the API data using the slug
    const requestSlug = details?.jsonpricing_fieldinsurance;

    // Fetch API call
    useEffect(() => {
        if (requestSlug) {
            fetch(`https://api.rahnamayefarda.ir/api/paramstep?command=getparamstep&paramstep_fieldinsurance=${requestSlug}`, {
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    setSteps(data.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching steps:", error);
                    setLoading(false);
                });
        }
    }, [requestSlug]);

    // Parse the JSON details object
    const detail = details?.jsonpricing_request_detail ? JSON.parse(details.jsonpricing_request_detail) : {};
    // Utility functions...
    const cleanFieldName = (fieldName: string): string => {
        if (fieldName.includes('command=')) {
            const regex = /command=get_([a-zA-Z0-9_]+)/;
            const match = fieldName.match(regex);
            if (match && match[1]) {
                return match[1].replace(/_name$/, '') + '_name';
            }
        }
        return fieldName;
    };

    const mapBinaryValue = (value: any): string => {
        if (value === '1') return 'بله';
        if (value === '0') return 'خیر';
        return value;
    };

    const hasCommonCharacters = (str1: string, str2: string): boolean => {
        const regex = /(.{5,})/g;
        const matches = str1.match(regex);
        return !!matches && matches.some(match => str2.includes(match));
    };

    const isMultiCounterField = (step: any): boolean => step.field_kind_nameen === 'multi_counter';

    // Compare steps with detail, applying explicit mappings first
    const compareStepsWithDetails = () => {
        if (!steps.length || !detail) return [];

        return steps.map((step: any) => {
            const apiName = step.paramstep_apiorname;

            const mappedPaths = explicitFieldMap[apiName];
            if (mappedPaths) {
                // Handle multiple mapped fields (array) or single string field
                if (Array.isArray(mappedPaths)) {
                    // Collect values for all mapped fields, skip undefined/null
                    const values = mappedPaths.map(path => {
                        const rawValue = getNestedValue(detail, path);
                        if (rawValue === undefined || rawValue === null || rawValue === '') return null;

                        if (Array.isArray(rawValue)) {
                            return rawValue
                                .map((item: any) => item.name + (item.value ? ` (${item.value})` : ''))
                                .join(', ');
                        } else {
                            return step.field_kind_nameen !== 'input_numunit'
                                ? mapBinaryValue(rawValue)
                                : rawValue;
                        }
                    }).filter(v => v !== null);

                    return { label: step.paramstep_name, value: values.join(' - ') };
                } else {
                    const rawValue: any = getNestedValue(detail, mappedPaths);
                    if (rawValue !== undefined) {
                        let value: any;
                        if (Array.isArray(rawValue)) {
                            value = rawValue
                                .map((item: any) => item.name + (item.value ? ` (${item.value})` : ''))
                                .join(', ');
                        } else {
                            value = step.field_kind_nameen !== 'input_numunit'
                                ? mapBinaryValue(rawValue)
                                : rawValue;
                        }
                        return { label: step.paramstep_name, value };
                    }
                }
            }

            // 2. Fallback to generic logic
            const cleanedName = cleanFieldName(apiName);
            let value = '';

            if (!apiName.includes('command=')) {
                value = detail[apiName] ?? '';
                if (!value) {
                    for (const key in detail) {
                        if (hasCommonCharacters(apiName, key)) {
                            value = detail[key];
                            break;
                        }
                    }
                }
            } else {
                value = detail[cleanedName] ?? '';
                if (!value) {
                    for (const key in detail) {
                        if (hasCommonCharacters(cleanedName, key)) {
                            value = detail[key];
                            break;
                        }
                    }
                }
            }

            if (step.field_kind_nameen !== 'input_numunit') {
                value = mapBinaryValue(value);
            }

            if (isMultiCounterField(step)) {
                let total = 0;
                Object.keys(detail).forEach(key => {
                    if (key.startsWith('travel_passenger_id') || key.startsWith('therapy_age_id')) {
                        total += Number(detail[key]) || 0;
                    }
                });
                value = total.toString();
            }

            return {
                label: step.paramstep_name,
                value: value || ''
            };
        });
    };

    const comparisonData = compareStepsWithDetails();

    return (
        <div>
            <div className={'font-bold text-center my-2 border-b border-secondary/10 pb-2'}>
                {steps[0]?.fieldinsurance_fa}
            </div>
            {loading ? (
                <p>در حال بارگذاری...</p>
            ) : (
                <ul className="text-sm prose max-w-full text-justify leading-6 list-disc pl-5 grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 grid list-inside">
                    {comparisonData.map((item, index) => (
                        <li key={index}>
                            <strong>{item.label}:</strong> {item.value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InputsSummary;