const { net } = require('electron');
const path = require('path');
const fs = require('fs');

class LicenseValidator {
  constructor(productId) {
    this.productId = productId;
    this.licenseFile = path.join(__dirname, '..', '..', 'license.json');
  }

  async validateLicense(licenseKey, checkUsage = false) {
    try {
      const formData = new URLSearchParams();
      formData.append('product_id', this.productId);
      formData.append('license_key', licenseKey);
      formData.append('increment_uses_count', checkUsage.toString());

      const response = await this.makeRequest('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.success) {
        const licenseData = {
          licenseKey,
          validated: true,
          validatedAt: new Date().toISOString(),
          uses: response.uses,
          purchase: response.purchase
        };
        
        await this.saveLicenseData(licenseData);
        return { valid: true, data: licenseData };
      } else {
        return { valid: false, error: 'Invalid license key' };
      }
    } catch (error) {
      console.error('License validation error:', error);
      return { valid: false, error: error.message };
    }
  }

  async makeRequest(url, options) {
    return new Promise((resolve, reject) => {
      const request = net.request({
        method: options.method,
        url: url,
        headers: options.headers
      });

      let responseData = '';

      request.on('response', (response) => {
        response.on('data', (chunk) => {
          responseData += chunk.toString();
        });

        response.on('end', () => {
          try {
            const data = JSON.parse(responseData);
            resolve(data);
          } catch (parseError) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      if (options.body) {
        request.write(options.body);
      }
      
      request.end();
    });
  }

  async saveLicenseData(data) {
    try {
      await fs.promises.writeFile(this.licenseFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving license data:', error);
    }
  }

  async loadLicenseData() {
    try {
      const data = await fs.promises.readFile(this.licenseFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async isLicenseValid() {
    const licenseData = await this.loadLicenseData();
    if (!licenseData || !licenseData.validated) {
      return false;
    }

    // Check if license was validated within the last 30 days
    const validatedAt = new Date(licenseData.validatedAt);
    const now = new Date();
    const daysDiff = (now - validatedAt) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 30) {
      // Re-validate license without incrementing usage count
      const result = await this.validateLicense(licenseData.licenseKey, false);
      return result.valid;
    }

    return true;
  }

  async clearLicenseData() {
    try {
      if (fs.existsSync(this.licenseFile)) {
        await fs.promises.unlink(this.licenseFile);
      }
    } catch (error) {
      console.error('Error clearing license data:', error);
    }
  }
}

module.exports = LicenseValidator;