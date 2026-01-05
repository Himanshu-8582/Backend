import { asyncHandler } from "../utils/asyncHandler";

export const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    // Todo: create playlist
});

export const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // TODO: get user playList
});

export const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: get user playList by id
});

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: add video
});

export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
});

export const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist
});

export const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    // Todo: update palylist
});