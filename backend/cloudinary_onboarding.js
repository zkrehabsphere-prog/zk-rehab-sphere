const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dhyeoatvi', // ← replace this if needed
  api_key: '578765569697887', // ← replace this if needed
  api_secret: '22M-kdNWJmnEcI-ZRFff8JkYQ98', // ← replace this if needed
});

async function main() {
  try {
    console.log('Starting Cloudinary onboarding script...');

    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    const uploadPublicId = `zk_rehab_onboarding_${Date.now()}`;

    const uploadResult = await cloudinary.uploader.upload(sampleImageUrl, {
      public_id: uploadPublicId,
      folder: 'zk_rehab_onboarding',
      overwrite: true,
    });

    console.log('Upload complete.');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    const resource = await cloudinary.api.resource(uploadResult.public_id);
    console.log('Image metadata:');
    console.log('  width:', resource.width);
    console.log('  height:', resource.height);
    console.log('  format:', resource.format);
    console.log('  bytes:', resource.bytes);

    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto', // f_auto: choose the best image format automatically
      quality: 'auto', // q_auto: choose the best quality/size balance automatically
    });

    console.log('Transformed URL:', transformedUrl);
    console.log('Done! Click link above to see optimized version of the image. Check the size and the format.');
  } catch (error) {
    console.error('Cloudinary onboarding failed:');
    console.error(error);
    process.exit(1);
  }
}

main();
