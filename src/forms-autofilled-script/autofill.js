export function AutoFill({ setValue, fields }) {
    console.log('fields', fields);
    Object.entries(fields).forEach(([name, value]) => {
        setValue(name, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    });
}
