#Promise
js是单线程的，所以js的所有网络操作，浏览器事件，都必须是异步执行。异步执行可以用回调函数实现。异步操作会在将来的某个时间点触发一个函数调用。


	function test(resolve, reject) {
   		var timeOut = Math.random() * 2;
		log('set timeout to: ' + timeOut + ' seconds.');
    	setTimeout(function () {
        	if (timeOut < 1) {
        	    log('call resolve()...');
        	    resolve('200 OK');
       		}
       	 	else {
            	log('call reject()...');
            	reject('timeout in ' + timeOut + ' seconds.');
        	}
    	}, timeOut * 1000);
	}

这个test函数两个参数都是函数，如果执行成功调用resolve，失败调用reject。可以看出，test函数只关心自己的逻辑，而不关心具体的resolve和reject将如何处理结果。

有了执行函数，我们就可以用一个Promise对象来执行它，并在将来某个时刻获得成功或失败的结果。Promise最大的好处就是再异步执行的流程中，把执行代码和处理结果的代码清晰地分离了。**promise还可以利用再这种情况：有若干个异步任务，需要先做任务1，如果成功后再做任务2，任何任务失败则不再继续并执行错误处理函数。**要执行这样地异步任务，不用promise需要写一层一层的嵌套代码。有了promise，我们只需要简单地写：

	job1.then(job2).then(job3).catch(hanlerError);

其中，job1，job2，job3都是Promise对象。

除了串行执行若干异步任务外，promise还可以并行执行异步任务。试想一个页面聊天系统，我们需要从两个不同的url分别获得用户的个人信息和好友列表，这两个任务是可以并行执行的，可以用Promise.all()。另外，new一个Promise对象的时候，要传入一个函数，这个函数一般都有两个参数，一个是resolve，另一个是reject，这两个参数实际代表的是异步操作执行成功和失败后的回调函数。下面的代码用setTimeOut模仿一个异步的操作。

	var p1 = new Promise(function (resolve, reject) {
	    setTimeout(resolve, 500, 'P1');
	});
	var p2 = new Promise(function (resolve, reject) {
	    setTimeout(resolve, 600, 'P2');
	});
	// 同时执行p1和p2，并在它们都完成后执行then:
	Promise.all([p1, p2]).then(function (results) {
	    console.log(results); // 获得一个Array: ['P1', 'P2']
	});

ES6原生支持Promise。

* promise对象有三种状态：Pending（进行中），Resolved（已完成），Rejected（已失败），其中只能从pending转到resolved或rejected，不能逆向转换，并且状态一旦转换完成后，就凝固了，不能够再改变了。
* Promise模式唯一需要的一个借口是调用then方法，它可以用来注册当promise完成或者失败时调用的回调函数。then方法接受两个参数，第一个是成功时的回调，另一个是失败时的回调。

Promise的then方法可以用来注册当Promise完成或者失败时调用的回调函数。Promise提供了一种优雅的解决方案，主要用法就是将各个异步操作封装成好多Promise，而一个Promise只处理一个异步逻辑，最后将各个Promise用链式调用写法串联。

### Promise对象的方法：

1. Resolve：该方法可以使 Promise 对象的状态改变成成功，同时传递一个参数用于后续成功后的操作。
2. Reject：该方法则是将 Promise 对象的状态改变为失败，同时将错误的信息传递到后续错误处理的操作。
3. Then: 所有的 Promise 对象实例里都有一个 then 方法，它是用来跟这个 Promise 进行交互的，then方法主要传入两个方法作为参数，一个resolve 函数，一个 reject 函数，链式调用 ，上一个Promise对象变为resolved的时候，调用then中的Resolve方法，否则调用Reject方法，且then 方法会缺省调用 resolve() 函数。
4. Catch：该方法是 then(onFulfilled, onRejected) 方法当中 onRejected 函数的一个简单的写法，也就是说也可以写成then，但是用来捕获异常时，用catch更加便于理解。
5. All：该方法可以接收一个元素为 Promise 对象的数组作为参数，当这个数组里面所有的 Promise 对象都变为 resolve 时，该方法才会返回。就是全部都执行完了才接着往下执行。
6. Race：竞速，类似All方法，它同样接收一个数组，不同的是只要该数组中的 Promise 对象的状态发生变化（无论是 resolve 还是 reject）该方法都会返回。就是只要某一个执行完了就接着往下执行。

### Promise的链式调用

要实现链式调用，在then中的resolve方法如何return很关键。在then方法中通常传递两个参数，一个resolve函数，一个reject函数。resolve函数必须返回一个值才能把链式调用进行下去。

* 在then的resolve方法中返回一个新的Promise对象
* 在then的resolve方法中返回一个值（这样会导致第一个then还未执行完就进入了第二个then）

# FileReader

FileReader对象允许web应用程序异步读取存储在用户计算机上的文件。

属性：

1. FileReader.error(or)
2. FileReader.readyState(or)
	* EMPTY: 0 [还没有加载任何数据]
	* LOADING 1 [数据正在被加载]
	* DONE 2 [已完成全部的读取请求]
3. FileReader.result：文件的内容，该属性只有在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。

事件处理：

1. FileReader.onabort(读取操作被中断)
2. FileReader.onerror(读取操作发生错误)
3. FileReader.onload(读取操作完成)
4. FileReader.onloadstart
5. FileReader.onloadend(读取操作完成，成功或失败)
6. FileReader.onprogress(读取Blob时触发)

方法：

1. FileReader.abort()：中止读取操作，readyState属性设为DONE
2. FileReader.readAsArrayBuffer():开始读取指定Blob中的内容，一旦完成，result属性中保存的是被读取文件的ArrayBuffer数据对象
3. FileReader.readAsBinaryString()：开始读取指定Blob中的内容，一旦完成，result属性中将包含所读取文件的原始二进制数据
4. FileReader.readAdDataURL():开始读取指定Blob中的内容，一旦完成，result属性中将包含一个data：URL格式的字符串以表示所读取文件的内容。使用base-64编码"data:image/jpeg;base64, + 编码后的图片内容
5. FileReader.readAsText():开始读取Blob中的内容。一旦完成，result属性中将包含一个字符串以表示所读取的文件内容。