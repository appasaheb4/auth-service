import React from 'react';
import {
	AccessToken,
	GraphRequest,
	GraphRequestManager,
	LoginManager,
} from 'react-native-fbsdk';

export class FBAuth {
	static logoutWithFacebook = () => {
		LoginManager.logOut();
	};

	static getInfoFromToken = (token: any): Promise<any> =>
		new Promise((resolve, reject) => {
			try {
				const PROFILE_REQUEST_PARAMS = {
					fields: {
						string: 'id,name,first_name,last_name,email',
					},
				};
				const profileRequest = new GraphRequest(
					'/me',
					{ token, parameters: PROFILE_REQUEST_PARAMS },
					(error, user) => {
						if (error) {
							console.log(`login info has error: ${error}`);
						} else {
							resolve(user);
						}
					},
				);
				new GraphRequestManager().addRequest(profileRequest).start();
			} catch (error) {
				reject(error);
			}
		});

	static loginWithFacebook = async (): Promise<any> =>
		new Promise((resolve, reject) => {
			try {
				// Attempt a login using the Facebook login dialog asking for default permissions.
				LoginManager.logInWithPermissions(['public_profile']).then(
					(login) => {
						if (login.isCancelled) {
							console.log('Login cancelled');
						} else {
							AccessToken.getCurrentAccessToken().then(async (data: any) => {
								const accessToken = await data.accessToken.toString();
								await this.getInfoFromToken(accessToken).then((user: any) => {
									resolve(user);
								});
							});
						}
					},
					(error) => {
						console.log(`Login fail with error: ${error}`);
					},
				);
			} catch (error) {
				reject(error);
			}
		});
}
