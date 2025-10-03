import User, { IUser } from '../models/User.model';
import { verifyFirebaseToken, getFirebaseUser } from '../config/firebase';

export class AuthService {
  // Create or update user in MongoDB after Firebase authentication
  async createOrUpdateUser(
    uid: string,
    email: string,
    displayName?: string,
    photoURL?: string,
    provider: 'email' | 'google' = 'email'
  ): Promise<IUser> {
    try {
      let user = await User.findOne({ uid });

      if (user) {
        // Update existing user
        user.displayName = displayName || user.displayName;
        user.photoURL = photoURL || user.photoURL;
        user.lastLoginAt = new Date();
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          uid,
          email,
          displayName,
          photoURL,
          provider,
          lastLoginAt: new Date(),
        });
      }

      return user;
    } catch (error: any) {
      throw new Error(`Failed to create/update user: ${error.message}`);
    }
  }

  // Verify Firebase token and sync with MongoDB
  async verifyAndSyncUser(idToken: string): Promise<IUser> {
    try {
      // Verify token with Firebase
      const decodedToken = await verifyFirebaseToken(idToken);

      // Get user details from Firebase
      const firebaseUser = await getFirebaseUser(decodedToken.uid);

      // Determine provider
      const provider = firebaseUser.providerData[0]?.providerId.includes('google')
        ? 'google'
        : 'email';

      // Create or update user in MongoDB
      const user = await this.createOrUpdateUser(
        firebaseUser.uid,
        firebaseUser.email!,
        firebaseUser.displayName,
        firebaseUser.photoURL,
        provider as 'email' | 'google'
      );

      return user;
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  // Get user by UID
  async getUserByUid(uid: string): Promise<IUser | null> {
    try {
      return await User.findOne({ uid });
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
}

export default new AuthService();
