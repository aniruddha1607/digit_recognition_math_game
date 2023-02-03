var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json')

}

function predictImage() {
    // console.log('processing ...');

    let image = cv.imread(canvas);
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    // You can try more different parameters
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect)

    var height = image.rows;
    var width = image.cols;

    

    if (height > width) {
        height = 20;
        const scaleFactor = image.rows / height;
        width = Math.round(image.cols / scaleFactor);
        
    }

    else {
        width = 20;
        const scaleFactor = image.cols / width;
        height = Math.round(image.rows / scaleFactor);
        
    }

    let newSize = new cv.Size(width, height);
    cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

    const RIGHT = Math.floor(4 + (20 - width)/2);
    const LEFT = Math.ceil(4 + (20 - width)/2);
    const TOP = Math.ceil(4 + (20 - height)/2);
    const BOTTOM = Math.floor(4 + (20 - height)/2);
    // console.log(RIGHT, LEFT, TOP, BOTTOM)

    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT);

    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false)

    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;

    const shift_x = Math.round(image.cols/2 - cx);
    const shift_y = Math.round(image.rows/2 - cy);


    const BLACK = new cv.Scalar(0, 0, 0, 0);

    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, shift_x, 0, 1, shift_y]);
    let dsize = new cv.Size(image.rows, image.cols);
    cv.warpAffine(image, image, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

    let pixelValues = image.data;
    pixelValues = Float32Array.from(pixelValues);

    pixelValues = pixelValues.map((item) => {
        return item / 255 ;
    })

    // console.log(pixelValues);

    const X = tf.tensor([pixelValues]);
    res = model.predict(X)
    res.print();

    output = res.dataSync()[0];

    // console.log(tf.memory());

    // // Testing Only (delete later)
    // const outputCanvas = document.createElement('CANVAS');
    // cv.imshow(outputCanvas, image);
    // document.body.appendChild(outputCanvas);

    // Cleanup
    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    M.delete(); 
    X.dispose();
    res.dispose();

    return output;



}