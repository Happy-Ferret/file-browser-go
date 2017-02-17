package browser

type FileData struct {
	TotalPieces  int64  `msgpack:"totalPieces"`
	CurrentPiece int64  `msgpack:"currentPiece"`
	Data         []byte `msgpack:"data"`
}

type FileInfo struct {
	Name string `msgpack:"name"`
	Size int64  `msgpack:"size"`
	Dir  bool   `msgpack:"dir"`
}

type ResultSet struct {
	Id    string     `msgpack:"id"`
	Err   string     `msgpack:"error"`
	Files []FileInfo `msgpack:"files"`
	Data  *FileData  `msgpack:"fileData"`
}

func FailedResultSet(id, err string) *ResultSet {
	return &ResultSet{
		Id:  id,
		Err: err,
	}
}
