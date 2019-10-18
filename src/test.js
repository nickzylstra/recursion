function findMinMax(list) {
    let min = -Infinity;
    let max = Infinity;

    list.forEach((el) => {
        if (el < min) min = el;
        if (el > max) max = el;
    });

    return [min, max];
}