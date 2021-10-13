import React from 'react';
import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
	webClientId:
    'yourkey',
});

export class GoogleAuth {
	static signInWithGoogle = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			return userInfo.user;
		} catch (error) {
			Alert.alert(
				'Technical issue',
				'Your request cannot be processed. Please try again later.',
				[
					{
						text: 'Ok',
					},
				],
				{ cancelable: false },
			);
		}
	};

	static revokeAccess = async () => {
		try {
			await GoogleSignin.revokeAccess();
		} catch (error) {
			Alert.alert(
				'Technical issue',
				'Your request cannot be processed. Please try again later.',
				[
					{
						text: 'Ok',
					},
				],
				{ cancelable: false },
			);
		}
	};
}
