
export const isPointInside = (point, rect) => {
    return (
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height
    );
};

export const measureDropZone = (ref) => {
    return new Promise((resolve) => {
        ref.current?.measureInWindow((x, y, width, height) => {
            resolve({ x, y, width, height });
        });
    });
};