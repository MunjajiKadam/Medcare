import { executeQuery } from '../config/database.js';
import AppError from '../utils/AppError.js';

// Get system settings
export const getSettings = async (req, res, next) => {
    try {
        const settings = await executeQuery('SELECT setting_key, setting_value FROM system_settings');

        // Transform into a flat object
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.setting_key] = curr.setting_value;
            return acc;
        }, {});

        res.json({
            status: 'success',
            settings: settingsObj
        });
    } catch (error) {
        next(error);
    }
};

// Update system settings
export const updateSettings = async (req, res, next) => {
    try {
        const { settings } = req.body; // settings should be an object: { maintenance_mode: 'true', etc. }

        if (!settings || typeof settings !== 'object') {
            return next(new AppError('Invalid settings data', 400));
        }

        for (const [key, value] of Object.entries(settings)) {
            await executeQuery(
                'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, value, value]
            );
        }

        res.json({
            status: 'success',
            message: 'System settings updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
